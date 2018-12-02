const SHA256 = require("crypto-js/sha256");

//define class for transaction
class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    //replace data with transactions
    constructor(timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("BLOCK MINED: " + this.hash);
    }
}


class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 1;
        this.pendingTransactions = [];
        this.miningReward = 0;
    }

    createGenesisBlock() {
        return new Block(Date.parse("2017-01-01"), [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    
    minePendingTransactions(miningRewardAddress){
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);
        
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [];
    }



    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    
    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

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
//intially all address balance is zero
let coin = new Blockchain();
//first transaction between address1 and address2
coin.createTransaction(new Transaction('address1', 'address2', 400));

console.log('\n Starting the miner...');
coin.minePendingTransactions('address2');

console.log('\nBalance of address2', coin.getBalanceOfAddress('address2'));

console.log('\n Starting the miner again...');
coin.minePendingTransactions('address1');

console.log('\nBalance of address1 is', coin.getBalanceOfAddress('address1'));

//second transaction betwen address3 and address4
coin.createTransaction(new Transaction('address3', 'address4', 200));

console.log('\n Starting the miner...');
coin.minePendingTransactions('address3');

console.log('\nBalance of address3', coin.getBalanceOfAddress('address3'));

console.log('\n Starting the miner again...');
coin.minePendingTransactions('address4');

console.log('\nBalance of address4 is', coin.getBalanceOfAddress('address4'));

//third transaction betwen address5 and address6
coin.createTransaction(new Transaction('address5', 'address6', 800));

console.log('\n Starting the miner...');
coin.minePendingTransactions('address5');

console.log('\nBalance of address3', coin.getBalanceOfAddress('address5'));

console.log('\n Starting the miner again...');
coin.minePendingTransactions('address6');

console.log('\nBalance of address4 is', coin.getBalanceOfAddress('address6'));




