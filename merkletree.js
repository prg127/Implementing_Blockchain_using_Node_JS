//require for unit tests of applications
const assert = require('assert');

const crypto = require('crypto');

//package require for merkle tree implementation
const MerkleTree = require('@garbados/merkle-tree')

class merkleTree{

constructor(digestFn,data){

assert(['string','function'].includes(typeof digestFn),'a merkle tree require a digest function.');

assert(data instanceof Array, 'A Merkle tree requires an array of values.');
if (typeof digestFn === 'string') {

    this.digestFn = MerkleTree.digestFn.bind(null, digestFn);

  }
  else {
    this.digestFn = digestFn;
  }

  const leaves = data.map(this.digestFn);
  this._levels = [leaves].concat(this._derive(leaves));
}

//Convenience wrapper around NodeJS' built-in crypto.
//it takes two parameter one for the type of algorithm use for cryptography and other is data that converted to the hash

static digestFn (hashType, data) {
    if (typeof data !== 'string') data = JSON.stringify(data);
    const hash = crypto.createHash(hashType);
    hash.update(data);
    return hash.digest('hex');
  }

  proof (index) {
    let proof = []

    for (let i = 0; i < this.depth; i++) {
      let level = this.levels[i]
      let width = level.length
      if (!(index === width - 1 && width % 2 === 1)) {
        const left = (index % 2) ? level[index - 1] : level[index]
        const right = (index % 2) ? level[index] : level[index + 1]
        proof.push([left, right])
      }
      index = Math.floor(index / 2)
    }

    return proof
  }


  _derive (data) {
    let level = []
    // successively hash arbitrary elements

    for (let i = 0; i < data.length; i += 2) {
      const left = data[i]
      const right = (i + 1 === data.length)
        ? left
        : data[i + 1]
      const node = JSON.stringify([left, right])
      level.push(this.digestFn(node))
    }


    if (level.length > 1) {
      // keep deriving among the middle nodes
      return [level].concat(this._derive(level))
    } else {
      // found root node
      return [level]
    }

  }

  //function to get the root of merkle tree
  get root () {
    return this.levels[this.levels.length - 1][0];
  }

 //function to get the number of levels in merkle tree
  get levels () {
    return this._levels;
  }

  //function to get the hash of each leaves
  get leaves () {
    return this.levels[0];
  }

}

// const tree = new merkleTree('sha256', [1, 2, 3, 4, 5, 6])
//   console.log(tree.root);




// const one = merkleTree.digestFn('sha256','helloworld');
// console.log(one);



const tree = new MerkleTree('sha256', [1,2,3,4,5,6,7,8]);
   const proof = tree.proof(3);
    console.log(tree.leaves[6] === proof[0][0]);
    console.log(tree.depth);
    console.log(tree.levels);
   // console.log(tree.leaves);
