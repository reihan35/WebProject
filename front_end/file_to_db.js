
//var fs = require('fs');

//var text = fs.readFileSync("text1.txt").toString('utf-8');

const lineReader = require('line-reader');

lineReader.eachLine('/path/to/file', function(line) {
    console.log(line);
});
let array = ["alors","comment","alors","c"];
function getWordCntRd(a) {
    return a.reduce((prev, nxt) => {
      prev[nxt] = (prev[nxt] + 1) || 1;
      return prev;
    }, {});
  }
console.log("hello");
console.log(getWordCntRd(array));


var myRe =  /[A-Z][a-z]*/g;
console.log('Now Is A Good Time'.match(/[A-Z][a-z]*/g));
