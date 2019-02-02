var fs = require('fs');
var crypto = require('crypto');

// the file you want to get the hash    
var fd = fs.createReadStream('1.txt');
var hash = crypto.createHash('sha1');

hash.setEncoding('hex');

// read all file and pipe it (write it) to the hash object
fd.pipe(hash);

fd.on('end', function() {
    hash.end();
    console.log(hash.read()); // the desired sha1sum
});

