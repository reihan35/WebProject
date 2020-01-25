const functions = require('firebase-functions');

const myHelloFun = require('./my_hello.js')



exports.myTest = functions.https.onRequest((req, res) => {

    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    return res.send({data:  myHelloFun.my_hello()});
    
});