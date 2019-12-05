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

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("b").click();
  }
});


//Creation of Book Object which will be used to add html
function Book(title, author, link,date){
  this.title = title;
  this.author = author;
  this.link = link;
  //this.centrality = centrality;
  this.data = date;
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
  kw = document.getElementById("s").value;
  searchDB(kw);
  $("body").empty();
  $("body").append(header);

};

const header = "<div class=\"header\">" + 
                "<div class=\"header-wrapper\">" + 
                  "<div class=\"logo\">" +
                      "<img src=\"search_logo.png\" alt=\"bird_logo\">" + 
                  "</div>" +
                  "<div class=\"search-zone\">" +
                    "<form id =\"s2\" class=\"search2\" >" +
                      "<input id = \"s\" name=\"search2\" type=\"search\" placeholder=\"Search here...\" required>" +
                      "<button id=\"b\" onclick=\"searchBooksWhereKW()\" type=\"button\" value=\"submit\">Search</button>" +
                    "</form>"+
                  "</div>"+
                  "<h3>Advanced Search</h3>" +
                  "<label class=\"switch2\">" +
                          "<input type=\"checkbox\">" +
                          "<span class=\"slider round\"></span>" +
                  "</label>" +
                "</div>"+
              "</div>" +
              "<div class=\"books-list\"></div>"


//Searchs for a special key in the DB and add results in the html file
function searchDB(key){
  var db = firebase.firestore();
  db.collection("books").where("words","array-contains",key).orderBy("closeness")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            var b = new Book();
            b.title = doc.id;
            b.author = "machin bidule"
            b.data = "5 mars 2019"
            b.link = "http://www.gutenberg.org/cache/epub/"+ doc.id +"/"+ doc.id + ".txt"
            $(".books-list").append(b.getHTML());

        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

};

