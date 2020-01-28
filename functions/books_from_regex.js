const Firestore = require('@google-cloud/firestore');
const PROJECTID = 'testdaar-ac65e';
const db = new Firestore({
  projectId: PROJECTID
});


const wregex = require('./words_from_regex.js')
const ordBooks = require('./order_books.js')

exports.books_from_regex = function(req, res) {

    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
  
    // Argument (string)
    try{
    	var regex = req.path.replace("/", "");
    }catch(TypeError){
	return []
    }

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
        res.send({
            ordered_books:ordered_books,
            words_matched:words_matched
        })
    
    })
    .catch(error => {
        res.status(500).send(error)
    })

    


}
