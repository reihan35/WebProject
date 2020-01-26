

const functions = require('firebase-functions');

const searchDBNoRegex_module = require('./searchDB_NoRegex.js')
const dataBookR_module = require('./data_book_research.js')
const suggNoRegex_module = require('./suggestionDB_NoRegex.js')

exports.searchDB_NoRegex = functions.https.onRequest((req, res) => {
    searchDBNoRegex_module.searchDB_NoRegex(req,res)
});

exports.data_book_research = functions.https.onRequest((req, res) => {
    dataBookR_module.data_book_research(req,res)
});

exports.suggestionDB_NoRegex = functions.https.onRequest((req, res) => {
    suggNoRegex_module.suggestionDB_NoRegex(req,res)
});