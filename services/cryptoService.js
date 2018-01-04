// Provides cryptographic functions

module.exports = (function(){
    var crypto = require('crypto');
    var config = require('../config');

    /**
     * Generates a cryptographically-secured random number.
     */
    async function generateCSRN(length){
        var salt = await crypto.randomBytes(length);
        return salt;
    }

    /**
     * Generates hash for the provided input. Uses the hash algorithm as configured in config.js
     * @param {*object} input 
     */
    function getHash(input){
        var hashAlgorithm = crypto.createHash(config.auth.hashAlgo);
        var hash = hashAlgorithm.update(input);
        return hash.digest(config.auth.hashAlgoEncoding);
    }

    return{
        generateCSRN : generateCSRN,
        getHash      : getHash
    };
})();