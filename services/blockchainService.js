module.exports = (function(){

    var Blockchain = require('../data structures/blockchain').BlockChain;

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

    function mineBlockchain(){
        // Get last proof of work from the last block in the blockchain
        var lastProofOfWork = blockchain.getLastBlock().proofOfWork;
        // Generate new proof of work. This is CPU-intensive. Add to worker process
        var proof = blockchain.generateProofOfWork(lastProofOfWork);
        // create the new block
        blockchain.addBlock(proof);
        return blockchain;
    }

    return {
        addTransaction : addTransaction,
        getBlockchain: getBlockchain,
        mineBlockchain: mineBlockchain
    };

})();