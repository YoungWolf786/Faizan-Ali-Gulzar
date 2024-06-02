const sha256 = require('sha256');
const currentnodeurl = process.argv[3]

function Blockchain(){
    this.chain = [];
    this.pendingTransactions = [];

    this.creatnewblock(100 , '0' , '0');
    this.currentnodeurl = currentnodeurl;
    this.networknode = [];
}

Blockchain.prototype.creatnewblock = function(nonce, prevblockhash , hash){
    const newblock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce,
        prevblockhash: prevblockhash,
        hash: hash,
    };

    this.pendingTransactions = [];
    this.chain.push(newblock);

    return newblock;

}

Blockchain.prototype.getlastblock = function(){
    return this.chain[this.chain.length - 1];
}

Blockchain.prototype.creatnewtransaction = function(amount , sender , recipient){
    const newtransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient,
    };
    this.pendingTransactions.push(newtransaction);

    return this.getlastblock()['index'] + 1;
}

Blockchain.prototype.hashblock = function(previousblockhash , currentblockdata , nonce){
    const dataastring = previousblockhash + nonce.toString() + JSON.stringify(currentblockdata);
    const hash = sha256(dataastring);
    return hash;
}

Blockchain.prototype.proofofwork = function(previousblockhash , currentblockdata){
    let nonce = 0;
    let hash = this.hashblock(previousblockhash , currentblockdata , nonce);

    while ( hash.substring(0,4)!=='0000'){
        nonce++;
        hash = this.hashblock(previousblockhash , currentblockdata , nonce);
        

    }

    return nonce;

}





module.exports = Blockchain;
