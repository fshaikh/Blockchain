/**
 * Represents a transaction or record in a blockchain
 */

 module.exports = (function(){

        function Transaction(sender,recepient,value){
            this.sender = sender;
            this.recepient = recepient;
            this.value = value;
        }

        return{
            Transaction: Transaction
        };
 })();