/**
 * Controller for handling Blockchain HTTP requests
 */

 module.exports = (function(){
     var blockchainService = require('../services/blockchainService');

    function BlockchainController(){

    }

    /**
     * Creates a new pending transaction in the blockchain
     * @param {*HTTP Request Object} req 
     * @param {*HTTP Response Object} res 
     */
    BlockchainController.prototype.createTransaction = function(req,res){
        // read the json object containing the transaction
        var data = req.jsonBody;

        blockchainService.addTransaction(data);


        res.writeHead(201,{'content-type':'application/json'});
        res.end(JSON.stringify(data));
    }

    BlockchainController.prototype.getBlockchain = function(req,res){
        var blockchain = blockchainService.getBlockchain();
        console.log(blockchain);
        res.writeHead(200,{'content-type':'application/json'});
        res.end(JSON.stringify(blockchain));
    }

    BlockchainController.prototype.mineBlockchain = async function(req,res){
        var blockchain = await blockchainService.mineBlockchainAsync();

        res.writeHead(201,{'content-type':'application/json'});
        res.end(JSON.stringify(blockchain));
    }

    BlockchainController.prototype.resolveBlockchain = async function(req,res){
        var status = await blockchainService.doConsensus();
        
       
        res.writeHead(201,{'content-type':'application/json'});
        res.end(status.toString());
    }

    return {
        BlockchainController : BlockchainController
    };
 })();