/**
 * Controller for Peer resource
 */

 module.exports = (function(){
    var PeerService = require('../services/peerService');

    function PeerController(){

    }

    /**
     * Adds a peer
     * @param {*HTTP Request object} req 
     * @param {*HTTP Response object} res 
     */
    PeerController.prototype.addPeer = function(req,res){
        var peer = req.jsonBody;

        PeerService.addPeer(peer);

        res.writeHead(201,{'content-type':'application/json'});
        res.end(JSON.stringify(peer));
    }

    PeerController.prototype.getPeers = function(req,res){
        var peers = PeerService.getPeers();
        res.writeHead(200,{'content-type':'application/json'});
        res.end(JSON.stringify(peers));
    }

    return{
        PeerController: PeerController
    };
 })();