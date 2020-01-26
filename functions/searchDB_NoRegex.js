const Firestore = require('@google-cloud/firestore');
const PROJECTID = 'testdaar-ac65e';
const db = new Firestore({
  projectId: PROJECTID
});


exports.searchDB_NoRegex = function(req, res) {
  // Renvoie la liste des livres qui contiennent key
  // Liste triée par indice de closeness (la bd est triée)

  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Argument (string)
  const key = req.path.replace("/", "");

  docRef = db.collection("words").doc(key);
  docRef.get().then(function(doc) {
    if (doc.exists) {
      let books = doc.data().book_list
      res.send({book_list:books})
    }
    else {
        res.send({book_list:[]})
    }
  })

  
  .catch(error => {
      res.status(500).send(error)
  })
}