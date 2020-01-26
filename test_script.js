
const db = firebase.firestore()

console.log("TEST SCRIPT")


async function book_data(books) {

    let promises = []

    for (i in books) {
        let p = db.collection("books").doc(books[i])
        .get().then(doc => {
            return {
                title : doc.data().title,
                author : doc.data().author,
                date : doc.data().release,
                link : "http://www.gutenberg.org/cache/epub/"+ doc.data().gut_num +"/pg"+ doc.data().gut_num + ".txt",
                clos_index : doc.data().clos_index
            }
        })
        promises.push(p)
    }

    return Promise.all(promises)
    .then(value => {
        console.log("PROMISES")
        console.log(value)
        return {data:value}
    })

}

/*console.log("BOOK DATA")
let res = book_data(["150","151","152","224","354"])

console.log(res)

res.then((valeur) => {
    console.log(valeur); // Succès !
    }, (raison) => {
    console.log(raison); // Erreur !
  })*/




async function suggestions(books) {
    // Renvoie la liste des suggestions de books, liste triée de livres

    // Limite des premiers livres à prendre en compte
    let limit = 3

    // Résultat à calculer
    var suggestion_set = new Set()
    var suggestions_list = []

    var promises1 = []

    // Remplissage des suggestions
    for (var i = 0 ; i < limit ; i++) {
        let p1 = await db.collection("books").doc(books[i])
        .get().then(bdoc => {
            if (bdoc.exists) {
                let neighbours = bdoc.data().neighbours

                let promises2 = []
                for (j in neighbours) {
                    let v = neighbours[j]
                    if ( (!suggestion_set.has(v)) && (!books.includes(v)) ) {
                        let p2 = db.collection("books").doc(v.toString())
                        .get().then(vdoc => {
                            //suggestions_list.push(
                            return {                               
                                    book:v,
                                    link: "http://www.gutenberg.org/cache/epub/"+ vdoc.data().gut_num +"/pg"+ vdoc.data().gut_num + ".txt",
                                    title : vdoc.data().title
                                }
                            //)
                        })
                        promises2.push(p2)
                    }
                }
                Promise.all(promises2)
                .then(values => {
                    console.log("PROMISES2")
                    console.log(values)
                    return values})

            }
            else {
                console.log("No such document!")
            }
        })
        promises1.push(p1)
    }

    Promise.all(promises1)
    .then(values => { 
        console.log("PROMISE 1")
        console.log(values)
        return values})
        
    console.log(suggestions_list.slice(0,10))
    //return suggestions_list.slice(0,10)

}

/*let res = suggestions(["200","201","202","203","204","205"])

console.log("RESULTAT FONCTION")
console.log(res)

res.then((valeur) => {
    console.log(valeur); // Succès !
    }, (raison) => {
    console.log(raison); // Erreur !
  });*/
  /*exports.searchDB_NoRegex = function(req, res) {
    // Renvoie la liste des livres qui contiennent key
    // Liste triée par indice de closeness (la bd est triée)
  
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
  
    // Argument (string)
    const key = req.path.replace("/", "");*/
    searchDB_NoRegex = function(key) {
  
    let limit_research_suggestion = 3
  
    var db = firebase.firestore();
    docRef = db.collection("words").doc(key);
    docRef.get().then(function(doc) {
      if (doc.exists) {
        var books = doc.data().book_list;
        var n = 0
        let promises = []
        for(x in books){
          docRef2 = db.collection("books").doc(""+books[x]);
          let p = docRef2.get().then(function(doc2) {
            if (doc.exists) {
              n = n + 1
              var b = {
                  title : doc2.data().title,
                  author : doc2.data().author,
                  date : doc2.data().release,
                  link : "http://www.gutenberg.org/cache/epub/"+ doc2.data().gut_num +"/pg"+ doc2.data().gut_num + ".txt"
              }
              return b
             
            }
            else{
              console.log("No such document!");
            }
          })
          promises.push(p)
        }
  
        let promises2 = []
        for (var i = 0;  i < Math.min(limit_research_suggestion,books.length) ; i++) {
          docRef2 = db.collection("books").doc(""+books[i]);
          console.log("ICI")
          console.log(books[i])
          let p2 = docRef2.get().then(function(doc2) {
              var suggestions = [] 
              let neighbours = doc2.data().neighbours;
                for (y in neighbours) {
                    if (!books.includes(neighbours[y])){
                      suggestions.push(neighbours[y])
                    }
                  }
              
                
                return suggestions
              })
              promises2.push(p2)
          }
          
          
        
          Promise.all(promises2)
          .then(values2 => {
  
          //console.log("VALUES PROMISES 2")
          var suggestions = new Set()
          for (var i in values2) {
              values2[i].forEach(n => suggestions.add(n))
          }
          //console.log(suggestions)
          
          // Suggestion data
          let promises3 = []
          for (let b of suggestions) {
              let p3 = db.collection("books").doc(""+b)
              .get().then(doc3 => {
                  return {
                      title : doc3.data().title,
                      author : doc3.data().author,
                      date : doc3.data().release,
                      link : "http://www.gutenberg.org/cache/epub/"+ doc3.data().gut_num +"/pg"+ doc3.data().gut_num + ".txt"
                  }
              })
              promises3.push(p3)
          }
          Promise.all(promises3)
          .then(values3 => {
              //console.log("DATA SUGGESTION")
              //console.log(values3)
              
              Promise.all(promises)
              .then(values => {
                  //console.log("VALUES PROMISES 1")
                  //console.log(values)
                  /*res.send({
                    book_list : values,
                    suggestions : values3
                  })*/
                  console.log("OUTPUT")
                  console.log(
                    {
                        book_list : values,
                        suggestions : values3
                      }
                  )
              })
          })
  
      })
        //$(".md-chips").hide();
     }
        else {
            console.log("ELSE")
            //res.send({books:[], suggestions:[]})
        }
    })
    .catch(error => {
        console.log("ERROR",error)
        //res.status(500).send(error)
    })
  }


/*return {txt:"bonjour",
            books : book_list.length,
            //suggestions : sugg
            //suggestions : Sugg.suggestions(book_list)
        }*/




let res_noregex = searchDB_NoRegex("bg")

console.log("RESULTAT res no regex")
console.log(res_noregex)
/*res_noregex.then((valeur) => {
    console.log(valeur); // Succès !
    }, (raison) => {
    console.log(raison); // Erreur !
  });*/


