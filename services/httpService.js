/**
 * Provides functions for making outbound HTTP(S) calls
 */

 module.exports = (function(){
    var http = require('http');
    var url = require('url');

    /**
     * Executes a GET request
     * @param {*} url 
     * @param {*} path 
     */
    async function doGet(baseUrl,path){
        return new Promise((resolve,reject)=>{
            var parsedUrl = url.parse(baseUrl);
            var request = http.request(getRequestOptions(parsedUrl.hostname,parsedUrl.port,path),(res)=>{
                resolve(new Promise((resolve,reject)=>{
                    res.setEncoding('utf-8');
                    var response = '';
                    res.on('data',(data)=>{
                        response += data;
                    });
        
                    res.on('end',()=>{
                        response = response == null ? response : JSON.parse(response);
                        resolve(response);
                    });
                }));               
            });
    
            request.on('error',(error)=>{
                console.log(error);
                reject(error);
            });
            request.end();
        });
    }

  
    function getRequestOptions(host,port,path){
        return{
            host:host,
            port:port,
            path:path,
            method:'GET',
            headers:{
                'accept':'application/json'
            }
        };
    }

    return {
        doGet: doGet
    };
    
 })();