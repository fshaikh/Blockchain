module.exports = (function () {
    var config = {};

    // environment related configuration
    config.env = {};

    //Cloud hosts(AWS, Azure,etc) use the PORT variable to tell you on which port your server should listen for the routing to work properly.
    // determine the port to listen on by checking PORT first and giving it a default value otherwise
    config.env.port = process.env.PORT || 4001;

    //Blockchain crypto related configuration
    config.auth = {};
    config.auth.hashAlgo = 'sha256';
    config.auth.hashAlgoEncoding = 'hex';

    return config;
})();


