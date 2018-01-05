module.exports = (function(){

    var Blockchain = require('../data structures/blockchain').BlockChain;
    var PeerService = require('./peerService');
    var cryptoService = require('./cryptoService'); 
    var proofOfWorkService = require('./proofOfWorkService');
    var childProcess = require('child_process');

    var blockchain = new Blockchain();

    /**
     * Adds transaction to the node's blockchain
     * @param {*Transaction} transaction 
     */
    function addTransaction(transaction){
        blockchain.addTransaction(transaction);
    }

    function getBlockchain(){

        return blockchain;
    }

    /**
     * Mines the block. This involves:
     * 1. Generating a Proof Of Work to solve a CPU-heavy puzzle
     * 2. Creating a new Block
     * 3. Add pending transactions to the new block
     */
    function mineBlockchain(){
        // Get last proof of work from the last block in the blockchain
        var lastProofOfWork = blockchain.getLastBlock().proofOfWork;
        var proof = proofOfWorkService.generateProofOfWork(lastProofOfWork);
        // create the new block
        blockchain.addBlock(proof);
        return blockchain;   
    }

    async function mineBlockchainAsync(){
        return new Promise((resolve,reject)=>{
            // Get last proof of work from the last block in the blockchain
            var lastProofOfWork = blockchain.getLastBlock().proofOfWork;
            // Generate new proof of work. This is CPU-intensive. Add to worker process
            // 1. Fork the child process passing the module to be loaded in the child process. Node will spawn a new Node
            //    process with its own V8 instance, memory, etc. A separate IPC connection will be established between
            //    parent and forked process which can be used to establsh communication channel
            var forkedService = childProcess.fork('./services/proofOfWorkService.js');
            // 2. Send a message to the child process
            forkedService.send({'message':'generate',lastProofOfWork: lastProofOfWork});
            // 3. Listen for response from the child process
            // NOTE: Spawning a large number ofr child processes will have performance implication. Child processes will exit:
            //          1. When the parent process exits OR
            //          2. Explicitly exiting the child process
            forkedService.on('message',(proof)=>{
                // create the new block
                blockchain.addBlock(proof);
                resolve(blockchain);
            }); 
            forkedService.on('exit',()=>{
                console.log('child exited');
            });
            forkedService.on('error',(reason)=>{
                reject(reason);
            });
        });
        
    }

    /**
     * Computes the hash of a given block
     * @param {*Block} block 
     */
    function getBlockHash(block){
        // get a json representation of the block
        // NOTE: Ensure the keys are sorted to prevent generating inconsistent hashes
        // NOTE: JSON.stringify takes as second parameter a replacer function using which once cn alter the stringification result
        // In our case we are fetching the own enumerable peoperties of the Block object and sorting them to create an ordered dictionary
        var json = JSON.stringify(block,Object.keys(block).sort());
        // compute the hash
        var hash = cryptoService.getHash(json);
        return hash;
    }

    /**
     * When a new block is mined by a peer(node), other peers in the blockchain network need to arrive at a 
     * Consesus to sync the blockchain (so that all peers have the same copy of the blockchaib)
     * This function uses the "longest chain" as the authoritative standard
     */
    async function doConsensus(){
        // Make a note of our blockchain length
        var maxLength = blockchain.getChainLength();

        // Get all the peers in the blockchain network
        var peers = PeerService.getPeers();
        var length = peers.length;
        var newBlockchain = null;

        // Invoke each peer to get each peer's blockchain
        for (let index = 0; index < length; index++) {
            const peer = peers[index];
            // Get the peer's blockchain
            var peerBlockchain = await PeerService.getBlockchain(peer);
            if(peerBlockchain == null){
                console.log(`Peer ${peer.toString()} blockchain corrupted or unable to reach peer`);
                continue;
            }

            // Since we are using the "longest chain" as the basis for consensus, reject the blockchain which has less length than us
            if(peerBlockchain.blocks.length < length){
                continue;
            }
            // Validate the peer blockchain
            var isValid = validateBlockchain(peerBlockchain);
            if(!isValid){
                // Peer blockchain has failed the validation, cannot do a consensus
                console.log(`Peer ${peer.toString()} blockchain has failed consensus due to valdiation failure`);
                continue;
            }
            // Peer blockchain is valid, replace ours with the peer's
            newBlockchain = peerBlockchain;
        }
        if(newBlockchain){
            console.log(`Reached consensus with Peer . Replacing with the new blockchain`)
            buildNewBlockchain(newBlockchain);
            return true;
        }
        return false;
    }

    /**
     * Validates the given blockchain based on the following algorithm:
     * 1. If the hash of the block is not same as the previous hash entry, retuen false
     * 2. If the Proof Of Work soluton cannot be verified, return false
     * @param {*Blockchain} blockchain - Given blockchain to validate
     */
    function validateBlockchain(blockchain){
        var blocks = blockchain.blocks;
        var length = blocks.length;
        if(length === 0){
            return true;
        }
        var previousBlock = blocks[0];
        for (let index = 1; index < length; index++) {
            const element = blocks[index];

            // 1. Validate the hash
            // Read the previous hash stored in the current block
            var previousHash = element.previousHash;
            // Compute the hash of the previous block
            var computedHash = getBlockHash(previousBlock);
            if(previousHash !== computedHash){
                return false;
            }

            // 2. Validate the Proof of Work
            if(!proofOfWorkService.validateProofOfWork(previousBlock.proofOfWork,element.proofOfWork)){
                return false;
            }

            previousBlock = element;
        }
        return true;
    }

    function buildNewBlockchain(newBlockchain){
        blockchain.blocks = newBlockchain.blocks;
    }

    

    return {
        addTransaction : addTransaction,
        getBlockchain: getBlockchain,
        mineBlockchain: mineBlockchain,
        mineBlockchainAsync:mineBlockchainAsync,
        doConsensus: doConsensus,
        getBlockHash:getBlockHash
    };

})();