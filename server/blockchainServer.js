/**
 * Implements a blockchain HTTP server
 */
var http = require('http').createServer();
var config = require('../config');
var BlockchainController = require('./blockchainController').BlockchainController;
var PeerController = require('./peerController').PeerController;
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
    var path = urlParts.pathname;
    var method = request.method;
    console.log(urlParts.path);
    if(path === '/api/blockchain/transactions' && method === 'POST'){
        var controller = new BlockchainController();
        controller.createTransaction(request,response);
    }else if(path === '/api/blockchain' && method === 'GET'){
        var controller = new BlockchainController();
        controller.getBlockchain(request,response);
    }else if(path === '/api/blockchain/mine' && method === 'POST'){
        var controller = new BlockchainController();
        controller.mineBlockchain(request,response);
    }else if(path === '/api/blockchain/resolve' && method === 'POST'){
        var controller = new BlockchainController();
        controller.resolveBlockchain(request,response);
    }else if(path === '/api/peers' && method === 'POST'){
        var controller = new PeerController();
        controller.addPeer(request,response);
    }else if(path === '/api/peers' && method === 'GET'){
        var controller = new PeerController();
        controller.getPeers(request,response);
    }
}

_registerHandlers();

http.listen(config.env.port,() =>{
    console.log(`Blockchain Node Listening on ${config.env.port}`)
});


function _registerHandlers(){
    // Register catchall uncaught exception at process level
    process.on('uncaughtException', _handleUncaughtException);
}

/**
 * Event handler for uncaught exception
 * @param err - Object containing error information
 */
function _handleUncaughtException(err) {
    console.log(`Uncaught Exception: ${err}`);
}