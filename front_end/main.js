(function(){
  //initilize FireBase
  const config = {
      apiKey: "AIzaSyBqLlrq8RWvad2MwHmPo82qM8wZsPJYPuY",
      authDomain: "daar-e49b3.firebaseapp.com",
      databaseURL: "https://daar-e49b3.firebaseio.com",
      projectId: "daar-e49b3",
      storageBucket: "daar-e49b3.appspot.com",
      messagingSenderId: "1098553787855",
      appId: "1:1098553787855:web:7135bdd36d714177577eba",
      measurementId: "G-8GFNQRTLVY"
  };
   // Initialize Firebase
   firebase.initializeApp(config);
   //firebase.database();
})

//firebase.analytics();

function searchBooksWhereKW() { 
  kw = document.getElementById("s").value;
  
};
