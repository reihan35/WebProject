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
              "<div> Realese Date : " + this.date + "</div>" +
              "</div>"
        return s;
    }

//Gets the value given by the user in the search input
function searchBooksWhereKW() { 
  if ($('#cb2').is(':checked')){
    $("body .books-list").empty()
    kw = document.getElementById("s").value;
    searchDB(kw);
  }
  else {
    if($('#cb1').is(':checked')){
      //On change la fonction avec la deuxime facon avec les regex
      kw = document.getElementById("s").value;
      searchDB(kw);
    }
    kw = document.getElementById("s").value;
    searchDB(kw);
    $("body").empty();
    $("body").append(header);
  }

};

const header = "<div class=\"header\">" + 
                "<div class=\"header-wrapper\">" + 
                  "<div class=\"logo\">" +
                      "<img src=\"search_logo.png\" alt=\"bird_logo\">" + 
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
                "</div>"+
              "</div>" +
              "<div class = \"su\"> Suggestions related to your search </div>" +
              "<div class=\"md-chips\">" +
              "</div>"+
              "<div class=\"books-list\"></div>"

var wait = 0;
//Searchs for a special key in the DB and add results in the html file
function searchDB(key){
  var db = firebase.firestore();
  db.collection("data").where("words","array-contains",key)//.orderBy("clos_index")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            wait=wait + 1;
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            var b = new Book();
            b.title = doc.data().title;
            b.author = doc.data().author;
            b.date = doc.data().release;
            b.link = "http://www.gutenberg.org/cache/epub/"+ doc.id +"/pg"+ doc.id + ".txt"
            $(".books-list").append(b.getHTML());
            if(wait<3){
              for (var i = 0; i < 3; i++) {
                s = doc.data().neighbours[i]
                console.log("JE COMPRENDS +++++++++++" + db.doc("data/"+s).title)

                $(".md-chips").append(
                  "<div class=\"md-chip\">" +
                    doc.data().neighbours[i] + 
                "</div>");
              } 
            }
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

};


$( "#s" ).keypress(function( event ) 
{
  if ( event.which == 13 ) {
    document.getElementById("b").click();
  }
});

