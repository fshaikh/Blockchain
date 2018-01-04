/**
 * Represents a block in a blockchain. Each block has a hash of the previous block which makes them immutable
 */

 module.exports = (function(){
    var Transaction = require('./Transaction').Transaction;


    /**
     * 
     * @param {*string} previousHash  - Hash of the previous block in the block chain
     * @param {*string} proofOfWork - Proof computed using Proof Of Work Algorithm
     * @param {*number} index - Index of the block in the block chain
     */
    function Block(previousHash,proofOfWork,index){
        // Holds the transactions to be added to the block
        this.transactions = [];
        this.previousHash = previousHash;
        this.proofOfWork = proofOfWork;
        this.timestamp = Math.floor(new Date() /1000);
        this.index = index;
    }

    /**
     * Adds a new transaction to the block
     * @param {*Transaction} transaction - New transaction to be added to the block
     */
    Block.prototype.addTransaction = function(transaction){
        this.transactions.push(transaction);
    }

    Block.prototype.addTransactions = function(transactions){
        this.transactions = this.transactions.concat(transactions);
    }

    return{
        Block: Block
    };
 })();