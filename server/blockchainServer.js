/**
 * Implements a blockchain HTTP server
 */
var http = require('http').createServer();
var config = require('../config');
var BlockchainController = require('./blockchainController').BlockchainController;
var url = require('url');

http.on('request',handleRequest);


function handleRequest(request,response){
    initRequest(request,response);


   
}

function initRequest(req,res){
    var body = '';
    req.on('data',(data)=>{
        body+= data;
    });

    req.on('end',()=>{
        if(req.method === 'POST'){
            req.jsonBody = JSON.parse(body);
        }
        handleRoutes(req,res);
    });
}

function handleRoutes(request,response){
    var urlParts = url.parse(request.url);
    console.log(urlParts.path);
    if(urlParts.path === '/api/blockchain/transactions' && request.method === 'POST'){
        var controller = new BlockchainController();
        controller.createTransaction(request,response);
    }else if(urlParts.path === '/api/blockchain' && request.method === 'GET'){
        var controller = new BlockchainController();
        controller.getBlockchain(request,response);
    }else if(urlParts.path === '/api/blockchain/mine' && request.method === 'POST'){
        var controller = new BlockchainController();
        controller.mineBlockchain(request,response);
    }
}


http.listen(config.env.port,() =>{
    console.log(`Blockchain Node Listening on ${config.env.port}`)
});