const express = require('express')
const app = express();
const bodyparser = require('body-parser');
const {v4: uuidv4} = require('uuid');
const Blockchain = require('./Blockchain');
const port = process.argv[2];

const bitcoin = new Blockchain();

const nodeaddress = uuidv4().split('-').join('');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false}));

//this will give us a complete blockchain
  app.get('/blockchain', function (req, res) {
    res.send(bitcoin);
  })

//this is for creating a new transaction
  app.post('/transaction', function (req, res) {
    const blockindex = bitcoin.creatnewtransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json({note: `this transaction will be added in block ${blockindex}`});
  })

//mine a new block
app.get('/mine' , function(req , res){
  const lastblock = bitcoin.getlastblock();
  const prevblockhash = lastblock['hash'];

  const currentblockdata = {
    transaction: bitcoin.pendingTransactions,
    index: lastblock['index'] + 1
  }

  const nonce = bitcoin.proofofwork(prevblockhash , currentblockdata);

  const blockhash = bitcoin.hashblock(prevblockhash , currentblockdata , nonce);

  bitcoin.creatnewtransaction(0.105150 , "00000000" , nodeaddress);

  const newblock = bitcoin.creatnewblock(nonce , prevblockhash , blockhash);

  res.json({
    note: "new block mined successfully",
    block: newblock
  });
});

//a simple web wallet
app.get('/wallet', function (req, res) {
  res.sendFile(__dirname + "/index.html");
})


app.post('/wallet', function (req, res) {
  const blockindex = bitcoin.creatnewtransaction(req.body.amount, req.body.senderAddress, req.body.Recipientaddress);
  res.json({note: `this transaction will be added in block ${blockindex}`});
})


//registerv a node and broadcast it to a network
app.post('/register-and-broadcast-node' , function(req , res){

})

//this will register a node 
app.post('/register-node' , function(req , res){

})

//this will register multiple nodes
app.post('/register-node-bulk' , function(req , res){
  
})

app.listen(port , function(){
    console.log(`Server is running on ${port}....`)
});