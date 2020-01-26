const Firestore = require('@google-cloud/firestore');
const PROJECTID = 'testdaar-ac65e';
const db = new Firestore({
  projectId: PROJECTID
});


const wregex = require('./words_from_regex.js')
const ordBooks = require('./order_books.js')

exports.suggestions_from_regex = function(req, res) {

    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    const limit_research_suggestion = 3;
  
    // Argument (string)
    var regex = req.path.replace("/", "");

    let res_regex = wregex.words_from_regex(regex)
    let words_matched = res_regex.match
    let nb_books = res_regex.nb_books

    let promises = []
    for (var i in words_matched)
    {
        let p = db.collection("words").doc(words_matched[i])
        .get().then(doc => {
            if (doc.exists) {
                return doc.data().book_list
            }
            else {
                return []
            }
        })
        promises.push(p)
    }

    Promise.all(promises)
    .then(values => {
        let ordered_books = ordBooks.order_books(values, words_matched, nb_books)

        let books = []
        for(var i = 0; i < ordered_books.length  ;i++){
            for(var f in ordered_books[i]){
                books.push(ordered_books[i][f][0])
            }
        }

        // Liste des voisins des premiers livres      
        let promises = []
        for (var i = 0; i < Math.min(limit_research_suggestion, books.length) ; i++) {
            docRef = db.collection("books").doc(""+books[i]);
            let p = docRef.get().then(function(doc) {
                var suggestions = [] 
                let neighbours = doc.data().neighbours;
                for (y in neighbours) {
                    if (!books.includes(neighbours[y])){
                        suggestions.push(neighbours[y])
                    }
                    }
                return suggestions
                })
                promises.push(p)
            }
        
        Promise.all(promises)
        .then(values => {
            // Union des voisins
            let suggestions = new Set()
            for (var i in values) {
                values[i].forEach(n => suggestions.add(n))
            }
            res.send({
              suggestions : Array.from(suggestions)
            })
        })
    
    })
    .catch(error => {
        res.status(500).send(error)
    })


}