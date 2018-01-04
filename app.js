

var Blockchain = require('./blockchain').BlockChain;
var Transaction = require('./transaction').Transaction;

var blockChain = new Blockchain();
// add a transaction
var transaction = new Transaction('furqan','sana',200);
console.log(blockChain.generateProofOfWork(100));
// blockChain.addTransaction(transaction);
// blockChain.addBlock(200);

// blockChain.addTransaction(transaction);
// blockChain.addBlock(300);



console.log(blockChain);

