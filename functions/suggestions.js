const Firestore = require('@google-cloud/firestore');
const PROJECTID = 'testdaar-ac65e';
const db = new Firestore({
  projectId: PROJECTID
});




exports.suggestions = function(books) {
    // Renvoie la liste des suggestions de books, liste triée de livres



    // Limite des premiers livres à prendre en compte
    let limit = 3

    // Résultat à calculer
    var suggestion_set = new Set()
    var suggestions_list = []

    // Remplissage des suggestions
    /*for (var i = 0 ; i < limit ; i++) {
        await db.collection("books").doc(books[i])
        .get().then(bdoc => {
            if (bdoc.exists) {
                let neighbours = bdoc.data().neighbours

                for (j in neighbours) {
                    let v = neighbours[j]
                    if ( (!suggestion_set.has(v)) && (!books.includes(v)) ) {
                        db.collection("books").doc(v.toString())
                        .get().then(vdoc => {
                            suggestions_list.push(
                                {
                                    book:v,
                                    link: "http://www.gutenberg.org/cache/epub/"+ vdoc.data().gut_num +"/pg"+ vdoc.data().gut_num + ".txt",
                                    title : vdoc.data().title
                                }
                            )
                        })
                    }
                }

            }
            else {
                console.log("No such document!")
            }
        })

    }

    
    return suggestions_list.slice(0,10)*/

    return "HELLO SUGGESTION"

}