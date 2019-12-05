  /*db.collection("data").doc("1329-0.txt")
    .get()
    .then(function(doc) {
      if (doc.exists) {
        console.log("Document data:", doc.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });

    /*var fields = db.collection("data").doc("11300.txt.utf-8")
    .get()
    .then(function(doc) {
      if (doc.exists) {
        doc.data().words
        console.log(typeof doc.data().words)
        console.log("Document data:", doc.data().words.keys);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });*/

    /*
    db.collection("data").collection("words")
    .get()
    .then(function(doc) {
      if (doc.exists) {
        console.log("Document data:", doc.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });
    */

  //console.log(query)
  //var query = data.where("words", "array-contains-any", key);
  //console.log(query)