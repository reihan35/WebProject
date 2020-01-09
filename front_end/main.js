//background:url(library.jpg) no-repeat center center fixed; background-size:cover;

(function(){
  //Web app configuration
  const config = {
    apiKey: "AIzaSyD0HqIvHaGJsviY4Ff3eAmUr8-foTbUWDo",
    authDomain: "testdaar-ac65e.firebaseapp.com",
    databaseURL: "https://testdaar-ac65e.firebaseio.com",
    projectId: "testdaar-ac65e",
    storageBucket: "testdaar-ac65e.appspot.com",
    messagingSenderId: "276572486310",
    appId: "1:276572486310:web:9500869e7369188daed267",
    measurementId: "G-RKFBM5NCFN"
  };

// Initialize Firebase
firebase.initializeApp(config);

}());

// Get the input field
var input = document.getElementById("s");
var Nodc;



//Creation of Book Object which will be used to add html
function Book(title, author, link,date){
  this.title = title;
  this.author = author;
  this.link = link;
  //this.centrality = centrality;
  this.date = date;
}

Book.prototype.getHTML =
    function(){
        s =  "<div class=\"result\">"+
              "<a href=\""+ this.link + "\">" + this.title + "</a>" +
              "<div>" + this.link + "</div>" + 
              "<div> By " + this.author + "</div>" +
              "<div> Realese Date : " + this.date + "</div>" 
              "</div>"
        return s;
    }

//Gets the value given by the user in the search input
function searchBooksWhereKW() { 
  var db = firebase.firestore();
  if ($('#cb2').is(':checked')){
    $("body .books-list").empty()
     //On change la fonction avec la deuxime facon avec les regex
     kw = document.getElementById("s").value;
     let result_parse = parse_regEx(kw);
     let words = words_from(result_parse,10);
     for (var i in words) {
       (function(i){
       console.log("je rentre " + words[i])
       docRef = db.collection("words").doc(words[i]);
       docRef.get().then(function(doc) {
         if (doc.exists) {
           console.log(existing)
           console.log("j'existe" + words[i])
           existing.push(words[i]);
           console.log(existing)
           searchDB(words[i]);
           $(".list").append("<li><a id =\""+i+"\" href=\"#\">" + words[i] +"</a></li>");
         }      
       })}).call(this, i);
     }
     console.log(existing)
     console.log("je suis la")
     $("body").empty();
     $("body").append(header);
     $(".su2").append("<h4>words matched with your regex</h4>");

  }
  else {
    if($('#cb1').is(':checked')){
      //On change la fonction avec la deuxime facon avec les regex
      kw = document.getElementById("s").value;
      let result_parse = parse_regEx(kw);
      let words = words_from(result_parse,10);
      for (var i in words) {
        (function(i){
        console.log("je rentre " + words[i])
        docRef = db.collection("words").doc(words[i]);
        docRef.get().then(function(doc) {
          if (doc.exists) {
            console.log(existing)
            console.log("j'existe" + words[i])
            existing.push(words[i]);
            console.log(existing)
            searchDB(words[i]);
            $(".list").append("<li><a id =\""+i+"\" href=\"#\">" + words[i] +"</a></li>");
          }      
        })}).call(this, i);
      }
      $("body").empty();
      $("body").append(header);
      $(".su2").append("<h4>words matched with your regex</h4>");
     
    }else{
      kw = document.getElementById("s").value;
      searchDB(kw);
      $("body").empty();
      $("body").append(header);
    }
  }
};



/*function doItOnlyFor(kw){
  console.log("voici le mot " + kw);
  $(".books-list").empty();
  searchDB(kw);
}*/

const header = "<div class=\"header\">" + 
                "<div class=\"header-wrapper\">" + 
                  "<div class=\"logo\">" +
                      "<img src=\"book4.png\" alt=\"bird_logo\">" + 
                  "</div>" +
                  "<div class=\"search-zone\">" +
                    "<form id =\"s2\" class=\"search2\" >" +
                      "<input id = \"s\" name=\"search2\" type=\"search\" placeholder=\"Search here...\" required>" +
                      "<button id=\"ib\" type=\"submit\"  onclick=\"searchBooksWhereKW()\" ><i class=\"fa fa-search\"></i></button>" +
                      //"<button id=\"b\" onclick=\"searchBooksWhereKW()\" type=\"button\" value=\"submit\">Search</button>" +
                    "</form>"+
                  "</div>"+
                  "<h3>Advanced Search</h3>" +
                  "<label class=\"switch2\">" +
                          "<input id=\"cb2\" type=\"checkbox\">" +
                          "<span class=\"slider round\"></span>" +
                  "</label>" +
                "</div>" +
              "</div>" +
              "<div class = \"su2\"></div>" +
              "<ul class=\"list\">" +
              "</ul>" + 
              "<div class = \"su\"> Suggestions related to your search </div>" +
              "<div class=\"md-chips\">" +
              "</div>"+
              "<div class=\"books-list\"></div>"





var wait = 0;

//Searchs for a special key in the DB and add results in the html file
function searchDB(key){
  Nodc = true;
  var res;
  console.log(key);
  var db = firebase.firestore();
  docRef = db.collection("words").doc(key);
  docRef.get().then(function(doc) {
    if (doc.exists) {
      var books = doc.data().book_list;
      console.log("Document data:", books);
      n = 0
      for(x in books){
        //console.log(books[0])
        docRef2 = db.collection("books").doc(""+books[x]);
        docRef2.get().then(function(doc2) {
          if (doc.exists) {
            n = n + 1
            var b = new Book();
            b.title = doc2.data().title;
            //console.log(doc2.data().title);
            b.author = doc2.data().author;
            b.date = doc2.data().release;
            b.link = "http://www.gutenberg.org/cache/epub/"+ doc2.data().gut_num +"/pg"+ doc2.data().gut_num + ".txt"
            
            $(".books-list").append("<h6>contains word " + key + "</h6>");
            $(".books-list").append(b.getHTML());
           /* if (n<3){
            var suggestions =  doc2.data().neighbours;
              for (y in suggestions) {
                s = db.collection("books").doc(y).get().then(function(doc3){
                  $(".md-chips").append(
                    "<div class=\"md-chip\">" +
                    "<a href=\""+ b.link + "\">" + b.title + "</a>" +
                  "</div>");
                })
              } 
            }*/
            console.log("je viens jusquà la")
            res=0;
          }
          else{
            console.log("No such document!");
            res=1;
          }
        })
      }
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        res=1;
    }
  }).catch(function(error) {
    console.log("Error getting document:", error);
  });
  return res;
};
