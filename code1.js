
//sha algorithm use for calculation of hash
const SHA256 = require("crypto-js/sha256");

//show all the block of blockchain on webpage 
var express = require('express');

var datetime = require('node-datetime');

var app  = express();

const hbs = require('hbs');

app.set('view engine','hbs');
//declare class for block 
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = this.calculateHash();
    }

    //create function to calculate the hash of particular block
    calculateHash() {
      return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

//declare class for blockchain
class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }
    //fucntion to create initial block of blockchain
    createGenesisBlock() {
        
        return new Block(0,"8-oct-2018", "Genesis block", "0");
    }

    
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {

        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
    

    //for conformation of block of particular blockchain
    isChainValid() {

        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
   
}

let coin = new Blockchain();
coin.addBlock(new Block(1, "8-oct-2018", { amount: 4 }));
coin.addBlock(new Block(2, "8-oct-2018", { amount: 8 }));
// coin.addBlock(new Block(3, "8-oct-2018", { amount: 12 }));
// coin.addBlock(new Block(4, "8-oct-2018", { amount: 16 }));
// coin.addBlock(new Block(5, "8-oct-2018", { amount: 20 }));
// coin.addBlock(new Block(6, "8-oct-2018", { amount: 24 }));
// coin.addBlock(new Block(7, "8-oct-2018", { amount: 28 }));
// coin.addBlock(new Block(8, "8-oct-2018", { amount: 32 }));
// coin.addBlock(new Block(9, "8-oct-2018", { amount: 36 }));
// coin.addBlock(new Block(10, "8-oct-2018", { amount: 40 }));
// coin.addBlock(new Block(11, "8-oct-2018", { amount: 44 }));
// coin.addBlock(new Block(12, "8-oct-2018", { amount: 48 }));
// coin.addBlock(new Block(13, "8-oct-2018", { amount: 52 }));
// coin.addBlock(new Block(14, "8-oct-2018", { amount: 56 }));
// coin.addBlock(new Block(15, "8-oct-2018", { amount: 60 }));
// coin.addBlock(new Block(16, "8-oct-2018", { amount: 64 }));
// coin.addBlock(new Block(17, "8-oct-2018", { amount: 68 }));
// coin.addBlock(new Block(18, "8-oct-2018", { amount: 72 }));
// coin.addBlock(new Block(19, "8-oct-2018", { amount: 76 }));
// coin.addBlock(new Block(20, "8-oct-2018", { amount: 80 }));


// console.log('blockchain valid ?'+coin.isChainValid());
// //one block data change then entire blockchain is not valid 
//  coin.chain[1].data={amount:100};
//  coin.chain[1].hash = coin.chain[1].calculateHash();
//  console.log(coin.chain[1].hash);
//  console.log('blockchain valid ?'+coin.isChainValid());



 
//  coin.chain[3].data={amount:12};
//  coin.chain[3].hash = coin.chain[3].calculateHash();
//  console.log(coin.chain[3].hash);
//  console.log('blockchain valid ?'+coin.isChainValid());


console.log(JSON.stringify(coin, null, 4));



//    app.get('/blocks',(req,res)=>{

//       res.send(JSON.stringify(coin, null, 4));
//     });


//  app.get('/about',(req,res)=>{
//     // let a=0;
//      //for(a=0;a<2;a++)
//      res.render('about.hbs',{
//        index: coin.chain[0].index,
//        hash:   coin.chain[0].hash,
//        data:   coin.chain[0].data,
//        prehash: coin.chain[0].previousHash,
//        timestamp: coin.chain[0].timestamp
//      });
//     });
  

//    app.listen(8080,()=>{
//     console.log('server is listening on 8080');
//    });
