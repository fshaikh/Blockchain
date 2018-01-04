/**
 * Represents a Peer in a blockchain network
 */

 module.exports = (function(){

    function Peer(url,name){
        this.url = url;
        this.name = name;
    }

    Peer.prototype.toString = function(){
        return `${name}-${url}`;
    }

    return{
        Peer: Peer
    };
 })();