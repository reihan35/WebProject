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

const preRes = document.getElementById('result');

//Searchs for a special key in the DB
function searchDB(key){
  var rootRef = firebase.database().ref()
  const dbRefObject = firebase.database().ref().child(key);
  dbRefObject.on('value', snap => {preObject.innerText = JSON.stringify(snap.val,null,3);
  });
}

//Gets the value given by the user to search in the DB
function searchBooksWhereKW() { 
  kw = document.getElementById("s").value;
  searchDB(kw);

};

