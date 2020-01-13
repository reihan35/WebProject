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
           console.log("j'existe" + words[i])
           searchDB(words[i]);
           $(".list").append("<li><a id =\""+i+"\" href=\"#\">" + words[i] +"</a></li>");
         }
         $(".list").hide();
       })}).call(this, i);
     }
     
     console.log("je suis la")
     $("body").empty();
     $("body").append(header);
     $(".su2").append("<h4 class=matched> Click to see words matched with your regex</h4>");
     if (j==0){
      $("body").empty();
      $("body").append(header);
      $(".su").hide();
      $("body").append("<h4 class=Nothing >Your RegEx " + kw + " did not match any documents.</h4>")
    }  

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
        var j = 0
        docRef.get().then(function(doc) {
          if (doc.exists) {
            console.log("j'existe" + words[i])
            searchDB(words[i]);
            j++;
            $(".list").append("<li><a id =\""+i+"\" href=\"#\">" + words[i] +"</a></li>");
            /*$( "#"+i ).click(function() {
              $(".books-list").empty();
              searchDB(words[i]);
            });*/
          }  
         $(".list").hide();
        })}).call(this, i);
      }
      $("body").empty();
      $("body").append(header);
      $(".su2").append("<h4 class=matched >Click to see words matched with your regex</h4>");
      //console.log(j)
      /*if (j==0){
        $("body").empty();
        $("body").append(header);
        $(".su").hide();
        $("body").append("<h4 class=Nothing >Your RegEx " + kw + " did not match any documents.</h4>")
      }  */
     
    }else{
      kw = document.getElementById("s").value;
      searchDB_NoRegex(kw);
      $("body").empty();
      $("body").append(header);
    }
  }
};

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
              "<div class = \"su\">Click to see suggestions related to your search </div>" +
              "<div class=\"md-chips\">" +
              "</div>"+
              "<div class=\"books-list\"></div>"


function order_books(kwlist){
  var db = firebase.firestore();
  var books_by_number_of_words = {};
  var books_by_number_of_words_order = {};
  for(i = 0; i < 500; i++){
    books_by_number_of_words[i] = [];
  }

  for(p = 0; p <= kwlist.length; p++){
   books_by_number_of_words_order[p] = [];
  }
  //console.log(books_by_number_of_words)
  for (var j in kwlist){
    (function(j){
    docRef = db.collection("words").doc(kwlist[j]);
    docRef.get().then(function(doc) {
    if (doc.exists) {
      console.log("je rentre")
      var books = doc.data().book_list;
      for (var l in books) {
        (function(l){
          console.log("JE SUIS J " + kwlist[j]);
          (books_by_number_of_words[books[l]]).push(kwlist[j])
        }).call(this, l);
      }
    }})}).call(this, j);
  }
  //console.log(books_by_number_of_words)
  for (var n in books_by_number_of_words){
    console.log("ahahaha" + books_by_number_of_words[n])
    //(function(n){
     // console.log("ahahaha" + books_by_number_of_words[n])
      for (s=0;s<kwlist.length;s++) {
        (function(s){
          console.log("JE RENTRE")
          console.log("s : " + s)
          console.log("books_by_number_of_words[n].length :" + books_by_number_of_words[n].length)
          if (books_by_number_of_words[n].length == s ){
              (books_by_number_of_words_order[s]).push(books_by_number_of_words[n])
          }
        }).call(this, s);
      }
    //}).call(this, n);
  }
  /*console.log(books_by_number_of_words)
  console.log(books_by_number_of_words[38])
  for (s=0;s<kwlist.length;s++){
    (function(s){
      console.log(kwlist.length)
      for (var n in books_by_number_of_words) {
        (function(n){
          console.log("n : " + n)
          console.log("s : " + s)
          console.log("books_by_number_of_words[n].length :" + books_by_number_of_words[38])
          if ((books_by_number_of_words[n]).length == s ){
              (books_by_number_of_words_order[s]).push(books_by_number_of_words[n])
          }
        }).call(this, n);
      }
    }).call(this, s);
  }*/
  console.log(books_by_number_of_words_order)

}

order_books(["hi","hello"])

function searchDB_NoRegex(key){
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
            
            $(".books-list").append(b.getHTML());
            if (n<3){
            var suggestions =  doc2.data().neighbours;
              for (y in suggestions) {
                s = db.collection("books").doc(suggestions[y]+"").get().then(function(doc3){
                  if (!books.includes[suggestions[y]]){
                    $(".md-chips").append(
                      "<div class=\"md-chip\">" +
                      "<a href=\""+ doc3.data().link + "\">" + doc3.data().title + "</a>" +
                    "</div>");
                  }
                })
              } 
            }
           
          }
          else{
            console.log("No such document!");
          }
        })
      }
      $(".md-chips").hide();
      console.log("je viens jusquà la" + $(".md-chips").is(":visible"))
    } else {
        // doc.data() will be undefined in this case
        $(".su").hide();
        $("body").append("<h4 class=Nothing >Your search " + kw + " did not match any documents.</h4>")
        console.log("No such document!");
    }
  }).catch(function(error) {
    console.log("Error getting document:", error);
  });
};

//Searchs for a special key in the DB and add results in the html file
function searchDB(key){
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
            if (n<3){
            var suggestions =  doc2.data().neighbours;
              for (y in suggestions) {
                s = db.collection("books").doc(suggestions[y]+"").get().then(function(doc3){
                  if (!books.includes[suggestions[y]]){
                    $(".md-chips").append(
                      "<div class=\"md-chip\">" +
                      "<a href=\""+ doc3.data().link + "\">" + doc3.data().title + "</a>" +
                    "</div>");
                  }
                })
              } 
            }
           
          }
          else{
            console.log("No such document!");
          }
        })
      }
      $(".md-chips").hide();
      console.log("je viens jusquà la" + $(".md-chips").is(":visible"))
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
  }).catch(function(error) {
    console.log("Error getting document:", error);
  });
};

$(document).on('click', '.su', function() { 
  console.log("je viens jusquà la" + $(".md-chips").is(":visible"))
  if($(".md-chips").is(":visible")){ 
    $(".md-chips").hide();
  }else{
    $(".md-chips").show();
} });

$(document).on('click', '.matched', function() { 
  console.log("je viens jusquà la" + $(".list").is(":visible"))
  if($(".list").is(":visible")){ 
    $(".list").hide();
  }else{
    $(".list").show();
} });

/*$( ".su" ).click(function() {
  console.log("je viens jusquà la" + $(".md-chips").is(":visible"))
  if($(".md-chips").is(":visible")){ 
    $(".md-chips").hide();
  }else{
    $(".md-chips").show();
  }
});*/
