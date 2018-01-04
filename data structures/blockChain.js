/**
 * Represents a block chain. Manages the block chain
 */

 module.exports = (function(){
    var Transaction = require('./transaction').Transaction;
    var Block = require('./block').Block;
    var cryptoService = require('../services/cryptoService');    
    
    /**
     *  Constructor function for a blockchain
     */
    function Blockchain(){
        this.currentTransactions = []; // Holds the pending transactions. These will be added to the block after mining
        this.blocks = [];  // Holds the blocks
        this.length = 0; // Cache of the blocks length

        // Create the Genesis block - a block with no predecessors
        this.addGenesisBlock();
    }

    /**
     * Adds anew Transaction to the list of pending/current transactions. This is not yet assigned a block which will
     * be done after the mining process
     * @param {*Transaction} transaction 
     */
    Blockchain.prototype.addTransaction = function(transaction){
        this.currentTransactions.push(transaction);
    };

    /**
     * Adds a genesis block to the block chain. Genesis block is first block which has no predecessors
     */
    Blockchain.prototype.addGenesisBlock = function(){
        return this.addBlock(100,1);
    };

    /**
     * Adds a new block to the block chain
     * @param {*object} proof - Proof of Work
     * @param {*string} previousHash - Hash of the previous block

     */
    Blockchain.prototype.addBlock = function(proof,previousHash = undefined){
        var hash = previousHash || this.getPreviousHash();
        // Create a new Block with the passed in hash and proof of work
        var block = new Block(hash,proof,this.blocks.length);
        // Add the current transactions to the block
        block.addTransactions(this.currentTransactions);
        // Reset the current tranasactions as they have been added to the blovk
        this.currentTransactions = [];
        // Add the block to the block chain
        this.blocks.push(block);

        // Return block to allow chaining
        return block;
    };

    Blockchain.prototype.getPreviousHash = function(){
        // get the previous block from the chain
        var previousBlock = this.blocks[this.blocks.length - 1];
        // get a json representation of the block
        // NOTE: Ensure the keys are sorted to prevent generating inconsistent hashes
        // NOTE: JSON.stringify takes as second parameter a replacer function using which once cn alter the stringification result
        // In our case we are fetching the own enumerable peoperties of the Block object and sorting them to create an ordered dictionary
        var json = JSON.stringify(previousBlock,Object.keys(previousBlock).sort());
        // compute the hash
        var hash = cryptoService.getHash(json);
        return hash;
    };

    /**
     * Validates the Proof of Work Problem
     * @param {*} lastProofOfWork 
     * @param {*} proof 
     * 
     */
    Blockchain.prototype.validateProofOfWork = function(lastProofOfWork,proof){
        // Combining Last POW and number
         var guess = `${lastProofOfWork}${proof}`;
        // Computing the hash
         var hash = cryptoService.getHash(guess);
        // Checking if the hash has 4 leading zeroes. To increase the computation time, you can increase the leading zeroes
        return hash.substring(0,4) === '0000';
    };

    /**
     * Proof Of Work is how blockchain mines (creates) a new block. When new transactions are created in the network,
     * miners (special nodes on the blockchain network) compete with each other to solve a problem. When any one miner solves the problem
     * first, it can generate the new block (adding transactions to it and adding to blockchain). The new blockchain is then propogated
     * through the entire network
     * The problem to be solved has the following characteristics:
     *  1. Easy to Verify
     *  2. Difficult to Find
     *  3. Computationally Expensive
     * The miner solving the problem is awarded (For eg: financially by getting issued a cryptocurrency)
     * Bitcoin uses a variation of POW algorithm called "HashCash". Read it up on wikipedia. The basic problem implemented in this code is as:
     * 
     * Find a number N that when hashed with the previous block’s POW number, a hash with 4 leading 0s is produced.
     * @param {*} lastProofOfWork 
     */
    Blockchain.prototype.generateProofOfWork = function(lastProofOfWork){
        var proof = 0;
        var times = 0;
        while(!this.validateProofOfWork(lastProofOfWork,proof)){
            proof++;
            times++;
        }
        console.log(times);
        return proof;
    };

    Blockchain.prototype.getLastBlock = function(){
        return this.blocks[this.blocks.length - 1];
    }

    return{
        BlockChain: Blockchain
    };
 })();