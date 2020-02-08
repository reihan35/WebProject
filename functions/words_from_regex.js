const fs = require('fs');

const data_file = '2000_wordlist.json'
const nb_books = 2000

exports.words_from_regex = function(regex) {

    // maximum des mots sortis par la regex (les plus rares en premier!)
    const limit = 10

    let rawdata = fs.readFileSync(data_file);
    let words = JSON.parse(rawdata).wordlist

    var regex = regex.replace(/%7C/g, '|'); 
    regex = new RegExp(regex)

    function matchExact(r, str) {
        var match = str.match(r);
        return match && str === match[0];
     }

    let match_regex = []

    for (var i in words) {
        if (match_regex.length > limit) {
            break;
        }
        if (matchExact(regex, words[i])) {
            match_regex.push(words[i])
        }
    }

    return {
        match:match_regex,
        nb_books:nb_books
    }

}