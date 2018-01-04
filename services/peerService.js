/**
 * Manages node discovery and storage
 */

 module.exports = (function(){
    var httpService = require('./httpService');

    // Set data structure to hold the peer nodes
    var peers = new Set();

    function addPeer(peer){
        peers.add(peer);
    }

    function removePeer(peer){
        peers.delete(peer);
    }

    function getPeers(){
        var iterator = peers.values();
        var data = [];
        for (const peer of iterator) {
            data.push(peer);
        }
        return data;
    }

    /**
     * Gets the blockchain from the passed in peer
     * @param {*Peer} peer 
     */
    async function getBlockchain(peer){
        var url = peer.url;
        var response = await httpService.doGet(url,'/api/blockchain');
        return response;
    }

    return{
        addPeer :addPeer,
        removePeer: removePeer,
        getPeers: getPeers,
        getBlockchain: getBlockchain
    };
 })();