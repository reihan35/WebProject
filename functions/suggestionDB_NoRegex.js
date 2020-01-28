const Firestore = require('@google-cloud/firestore');
const PROJECTID = 'testdaar-ac65e';
const db = new Firestore({
  projectId: PROJECTID
});


exports.suggestionDB_NoRegex = function(req, res) {

  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Argument (string)
  const key = req.path.replace("/", "");

  let limit_research_suggestion = 3

  docRef = db.collection("words").doc(key);
  docRef.get().then(function(doc) {
    if (doc.exists) {
      let books = doc.data().book_list;

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
        }
        else {
          res.send({
            suggestions:[]
          })
      }
  })
  .catch(error => {
      res.status(500).send(error)
  })
}
