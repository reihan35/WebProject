const Firestore = require('@google-cloud/firestore');
const PROJECTID = 'testdaar-ac65e';
const db = new Firestore({
  projectId: PROJECTID
});


exports.data_book_research = function(req, res) {

    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
  
    // Argument (string)
    const book = req.path.replace("/", "");

    db.collection("books").doc(book)
    .get().then(doc => {
        res.send({
            title : doc.data().title,
            author : doc.data().author,
            date : doc.data().release,
            link : "http://www.gutenberg.org/cache/epub/"+ doc.data().gut_num +"/pg"+ doc.data().gut_num + ".txt"
        })
    })

}