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
function Book(title, author, link,date,words){
  this.title = title;
  this.author = author;
  this.link = link;
  //this.centrality = centrality;
  this.date = date;
  this.words = words;
}

Book.prototype.getHTML =
    function(recherche_avancee){
        s =  "<div class=\"result\">"+
	     "<div >" + this.link + "</div>" + 
	     "<div class=link>" +
	     "<a href=\"#\" onclick='window.open(\" "+ this.link +"\");return false;'>"+ this.title +"</a>" + 
 	     "</div>" + 
              "<div> By " + this.author + "</div>" +
              "<div> Realese Date : " + this.date + "</div>" +
              "</div>"
              if (recherche_avancee){
                s = s + "<div> Contains : "
                for (var d in this.words){
                  //console.log("!!!!!!!!!!!!!" + this.words[d])
                  s = s + " " + this.words[d] 
                }
                s = s + "</div>"
              }
              
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
      docRef = db.collection("words").doc(words[i]);
      docRef.get().then(function(doc) {
        if (doc.exists) {
          $(".list").append("<li><a id =\""+i+"\" href=\"#\">" + words[i] +"</a></li>");
        }
        $(".list").hide();
      })}).call(this, i);
    }
    
    order_books(words);
     
     
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
        docRef = db.collection("words").doc(words[i]);
        docRef.get().then(function(doc) {
          if (doc.exists) {
            $(".list").append("<li><a id =\""+i+"\" href=\"#\">" + words[i] +"</a></li>");
          }
          $(".list").hide();
        })}).call(this, i);
      }
      order_books(words);
      /*for (var i in words) {
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
            });
          }
         $(".list").hide();
        })}).call(this, i);
      }*/
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


async function order_books(kwlist){
  console.log("LA LISTE DE MOT CLES" + kwlist)
  var db = firebase.firestore();
  var books_by_number_of_words = [];
  var books_by_number_of_words_order = [];
  for(i = 0; i < 500; i++){
    books_by_number_of_words.push([]);
  }

  for(p = 0; p <= kwlist.length; p++){
   books_by_number_of_words_order.push([]);
  }
  for (var j in kwlist){
    docRef = db.collection("words").doc(kwlist[j]);
    var books = await docRef.get().then(function(doc) {
      if (doc.exists) {
        return doc.data()
      }
      else {
        return []
      }
    })
    console.log("BOOKS")
    console.log(books)
    books = books.book_list
    for (var l in books) {
        (books_by_number_of_words[books[l]]).push(kwlist[j])
    }
    console.log("BOOKS of " + kwlist[j]);
    console.log(books)
  }
  
  for (var n in books_by_number_of_words){
      for (s=1;s<=kwlist.length;s++) {
          if (books_by_number_of_words[n].length == s ){
              (books_by_number_of_words_order[kwlist.length - s + 1]).push([n,books_by_number_of_words[n]])
          }
      }
  }
  console.log(books_by_number_of_words_order)
  console.log("JE RENTRE LA DEDANS MAIS JE NE COMPRENDS RIEN")
  //return books_by_number_of_words_order
  for(i = 0; i < books_by_number_of_words_order.length  ;i++){
   // console.log("JE RENTRE LA DEDANS MAIS JE NE COMPRENDS RIEN")
    for(var f in books_by_number_of_words_order[i]){
      //console.log(books_by_number_of_words_order[i][f])
      var key = books_by_number_of_words_order[i][f][0]
      var words1 = books_by_number_of_words_order[i][f][1]
     // console.log(words1)
      docRef = db.collection("books").doc(key);
      console.log("MAIS QUOI " + i + " " + f )
      let book = await docRef.get().then(function(doc) {
        if (doc.exists) {
          return doc.data()
        }
      })
        var b = new Book();
        b.title = book.title;
        b.author = book.author;
        b.date = book.release;
        b.words = words1;
        console.log("ET LAAAAAAA" + words1);
        //console.log(books_by_number_of_words_order[i][f][1])
        console.log("BON BAH JSP" + i + " " + f + " " + b.words)
        b.link = "http://www.gutenberg.org/cache/epub/"+ book.gut_num +"/pg"+ book.gut_num + ".txt"
        $(".books-list").append(b.getHTML(true));
        }
    }
  }
     /* var key = books_by_number_of_words_order[i][f][0]
      var words1 = books_by_number_of_words_order[i][f][1]
      docRef = db.collection("books").doc(key);
      docRef.get().then(function(doc) {
          if (doc.exists) {
            var b = new Book();
            b.title = doc.data().title;
            b.author = doc.data().author;
            b.date = doc.data().release;
            //b.words = words1;
            //console.log("BON BAH JSP" + b.words)
            b.link = "http://www.gutenberg.org/cache/epub/"+ doc.data().gut_num +"/pg"+ doc.data().gut_num + ".txt"
            $(".books-list").append(b.getHTML());

            /*if (n<3){
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
            $(".md-chips").hide();
            console.log("No such document!");
          }
        })
      }

  }
console.log("RESULTAT ORDER_BOOKS:")
console.log(books_by_number_of_words_order)
}*/

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
            
            $(".books-list").append(b.getHTML(false));
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
            b.words = [key]
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
