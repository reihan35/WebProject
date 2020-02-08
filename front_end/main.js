let functions = firebase.functions()
let db = firebase.firestore();

//Creation of Book Object which will be used to add html
function Book(title, author, link,date,words){
  this.title = title;
  this.author = author;
  this.link = link;
  //this.centrality = centrality;
  this.date = date;
  this.words = words;
}

function getHTML(b,recherche_avancee, words=[]){
  s =  "<div class=\"result\">"+
  "<div >" + b.link + "</div>" + 
  "<div class=link>" +
  "<a href=\"#\" onclick='window.open(\" "+ b.link +"\");return false;'>"+ b.title +"</a>" + 
  "</div>" + 
        "<div> By " + b.author + "</div>" +
        "<div> Realese Date : " + b.date + "</div>" +
        "</div>"
        if (recherche_avancee){
          var first = true
          s = s + "<div> Contains : "
          for (var d in words){
            if (first) {
              first = false
              s = s + " " + words[d] 
            }
            else {
              s = s + ", " + words[d] 
            }
          }
          s = s + "</div>"
        }
        
  return s;
}

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
          "<div class = \"su\" style=\"visibility= hidden;\">" +
          "Click to see suggestions related to your search" +
          "<div class=\"tooltip\"> " +
            "<a id=\"help\" href=\"#\">?</a> " +
         " <span class=\"tooltiptext\">Suggestions here are books close to the top three books matching your key word. They do not contain your keyword but may interest you because of their closeness to the most important results of your search </span>" +
          "</div>" +      
          "</div>" +
          "<div class=\"md-chips\">" +
          "</div>"+
          "<div class=\"lds-roller\"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>"+
          "<div class=\"books-list\"></div>"



function search_no_regex(kw) {
  // Recherche sur kw n'est pas un regex

  const url_search = 
  "https://us-central1-testdaar-ac65e.cloudfunctions.net/searchDB_NoRegex/" + kw


  fetch (url_search)
    .then(data => data.json())
    .then(res => {
      $(".su").show();

      let books_kw = res.book_list

      console.log("Livres recherche de " + kw + " :")
      console.log(books_kw)

      $(".lds-roller").hide();

      if (books_kw.length == 0) {
        $(".su").hide();
        $("body").append("<h4 class=Nothing >Your search " + kw + " did not match any documents. Maybe give a try to advanced search !</h4>")
        
      }

      else {

        // Remplissage du résultat de la recherche
        for (var i in books_kw) {
          let b = new Book();
          db.collection("books").doc(""+books_kw[i])
          .get().then(doc => {
            b.title = doc.data().title;
            b.author = doc.data().author;
            b.date = doc.data().release;
            b.link = "http://www.gutenberg.org/cache/epub/"+ doc.data().gut_num +"/pg"+ doc.data().gut_num + ".txt";
            $(".books-list").append(getHTML(b, false));
          })
          
        }


        // En parallèle, calcul des suggestions
        const url_sugg = "https://us-central1-testdaar-ac65e.cloudfunctions.net/suggestionDB_NoRegex/" + kw
        fetch (url_sugg)
          .then(data => data.json())
          .then(res => {
            let sugg_kw = res.suggestions

            console.log("Livres de la suggestion :")
            console.log(sugg_kw)
            if (sugg_kw.length==0){
              $(".su").hide()
              $(".su2").append("<h5>your key word is very common thus, we dont have any particualr suggestions for.<h5>")
            }
            x=0
            for (var i in sugg_kw) {
              x++
              if (x==16){
                break;
              }
              // Remplissage des résultats
              //const url_b = "https://us-central1-testdaar-ac65e.cloudfunctions.net/data_book_research/" + sugg_kw[i]
              let b = new Book();
              db.collection("books").doc(""+sugg_kw[i])
              .get().then(doc => {
                b.title = doc.data().title;
                b.link = "http://www.gutenberg.org/cache/epub/"+ doc.data().gut_num +"/pg"+ doc.data().gut_num + ".txt";
                $(".md-chips").append(
                  "<div class=\"md-chip\">" +
                  "<a href=\""+ b.link + "\">" + b.title + "</a>" +
                "</div>")
              })
            }
          })

        $(".md-chips").hide();
      }
        
    })

  $("body").empty();
  $("body").append(header);
}

function search_regex(kw) {
  // Recherche si kw est un regex
      
  const url_books_from_regex = "https://us-central1-testdaar-ac65e.cloudfunctions.net/books_from_regex/" + kw 
  try{
    console.log("TEST")
    fetch(url_books_from_regex)
    .then(data => data.json())
    .then(res => {
      //$(".lds-roller").hide();
      let words_matched = res.words_matched
      let books_by_number_of_words_order = res.ordered_books

      console.log("Mots qui matchent " + kw + " :")
      console.log(words_matched)
      console.log("Livres triés :")
      console.log(books_by_number_of_words_order)

      $(".lds-roller").hide();

      if (words_matched.length == 0){
        $(".su").hide();
        $(".matched").hide();
        $("body").append("<h4 class=Nothing >No matched word to your regex " + kw + " was found in the documents.</h4>")
        return
      }

      for (var i in words_matched) {
        word = words_matched[i]
          $(".list").append("<li><a id =\""+i+"\" href=\"#\">" + word +"</a></li>");
          $(".list").hide();
      }

      $(".su").show();
      $(".matched").show();

      for(i = 0; i < books_by_number_of_words_order.length  ;i++){
        for(var f in books_by_number_of_words_order[i]){
          const key = books_by_number_of_words_order[i][f][0]
          const words1 = books_by_number_of_words_order[i][f][1]
          let b = new Book();
          db.collection("books").doc(""+key)
          .get().then(doc => {
            b.title = doc.data().title;
            b.author = doc.data().author;
            b.date = doc.data().release;
            b.link = "http://www.gutenberg.org/cache/epub/"+ doc.data().gut_num +"/pg"+ doc.data().gut_num + ".txt";
            $(".books-list").append(getHTML(b, true, words1));
          })
          }
        }
      })
  }catch(TypeError){
    $("body").append("Your regex does not respect javascript regex syntax.")
  }
 
    

    // En parallèle, relancer un calcul pour avoir les suggestions :
    const url_suggestions_from_regex = "https://us-central1-testdaar-ac65e.cloudfunctions.net/suggestions_from_regex/" + kw
  
    fetch(url_suggestions_from_regex)
      .then(data => data.json())
      .then(res => {
        let suggestions = res.suggestions

        console.log("Livres de la suggestion :")
        console.log(suggestions)
        if (suggestions.length==0){
          $(".su").hide()
        }
        x = 0
        for (var i in suggestions) {
          x++
          if (x==15){
            break;
          }
          // Remplissage des résultats
          let b = new Book();
          db.collection("books").doc(""+suggestions[i])
          .get().then(doc => {
            b.title = doc.data().title;
            b.link = "http://www.gutenberg.org/cache/epub/"+ doc.data().gut_num +"/pg"+ doc.data().gut_num + ".txt";
            $(".md-chips").append(
              "<div class=\"md-chip\">" +
              "<a href=\""+ b.link + "\">" + b.title + "</a>" +
            "</div>")
          })
        }
        $(".md-chips").hide();
      })
      

    $("body").empty();
    $("body").append(header);
    $(".su2").append("<h4 class=matched> Click to see words matched with your regex</h4>");
    /*if (j==0){
    $("body").empty();
    $("body").append(header);
    $(".su").hide();
    $("body").append("<h4 class=Nothing >Your RegEx " + kw + " did not match any documents.</h4>")
  }  */
} 



//Gets the value given by the user in the search input
function searchBooksWhereKW() {
  var db = firebase.firestore();
  if ($('#cb1').is(':checked') || $('#cb2').is(':checked')){
    $("body .books-list").empty()
    //On change la fonction avec la deuxime facon avec les regex
    var kw = document.getElementById("s").value;
    
    if (kw.length == 0){
      return
    }
    
      // Passage en minuscules
      kw = kw.toLowerCase()
      
      // Enlève les espaces
      kw = kw.replace(/\s/g, '')
      
      console.log("IS REGEX : " + kw)
      search_regex(kw)
    

  }
  else {
    
    
    // S'il y a plusieurs mots => regex

    var kw = document.getElementById("s").value;
   
    if (kw.length == 0){
      return
    }
    console.log("la taille est " + kw.length);
    // Passage en minuscules
    kw = kw.toLowerCase()

    // Enlever les caractères spéciaux
    kw = kw.replace(/[^a-zA-Zçéàèùâêîôûë]/gi, ' ')

    // Isoler les mots
    kw = kw.trim();
    kw = kw.split(" ");

    console.log(kw)

    if (kw.length > 1) {
      // Il y a plusieurs mots => recherche regex
      var regex = ""
      var first = true
      for (var i in kw) {
        if (first) {
          first = false
          regex = regex + kw[i]
        }
        else {
          regex = regex + "|" + kw[i]
          
        }
      }
  
      console.log("IS REGEX : " + regex)
      search_regex(regex)
    }
    else {
        // Il y a qu'un seul mot => recherche normale
        console.log("IS NOT REGEX : " + kw[0])
        search_no_regex(kw[0])
    }

    }
  }





async function order_books(kwlist){
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
    books = books.book_list
    for (var l in books) {
        (books_by_number_of_words[books[l]]).push(kwlist[j])
    }
  }
  
  for (var n in books_by_number_of_words){
      for (s=1;s<=kwlist.length;s++) {
          if (books_by_number_of_words[n].length == s ){
              (books_by_number_of_words_order[kwlist.length - s + 1]).push([n,books_by_number_of_words[n]])
          }
      }
  }
  //return books_by_number_of_words_order
  for(i = 0; i < books_by_number_of_words_order.length  ;i++){
    for(var f in books_by_number_of_words_order[i]){
      var key = books_by_number_of_words_order[i][f][0]
      var words1 = books_by_number_of_words_order[i][f][1]
      docRef = db.collection("books").doc(key);
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
        b.link = "http://www.gutenberg.org/cache/epub/"+ book.gut_num +"/pg"+ book.gut_num + ".txt"
        $(".books-list").append(b.getHTML(true));
        }
    }
  }

$(document).on('click', '.su', function() { 
  if($(".md-chips").is(":visible")){ 
    $(".md-chips").hide();
  }else{
    $(".md-chips").show();
} });

$(document).on('click', '.matched', function() { 
  if($(".list").is(":visible")){ 
    $(".list").hide();
  }else{
    $(".list").show();
} });
