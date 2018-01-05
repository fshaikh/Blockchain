/**
 * Generates Proof of Work. Since this is a CPU-heavy operation, callin functions of the service on the Node main thread will
 * block the event loop and prevent Node from responding to other HTTP requests. Always run this module in a child process
 */

 module.exports = (function(){
     var cryptoService = require('./cryptoService');
    /**
     * Validates the Proof of Work Problem
     * @param {*} lastProofOfWork 
     * @param {*} proof 
     * 
     */
    function validateProofOfWork(lastProofOfWork,proof){
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
    function generateProofOfWork(lastProofOfWork){
        var proof = 0;
        while(!validateProofOfWork(lastProofOfWork,proof)){
            proof++;
        }
        return proof;
    };

    // Start listening for message from the parent process. data argument will contain the message payload from the parent
    process.on('message',(data) => {
        if(data.message === 'generate'){
            var proof = generateProofOfWork(data.lastProofOfWork);
            process.send(proof);
            // Exit the process
            process.exit();
        }
        
    });

    return {
        validateProofOfWork: validateProofOfWork,
        generateProofOfWork : generateProofOfWork
    };
 })();