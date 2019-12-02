(function(){
const firebaseConfig = {
    apiKey: "AIzaSyBqLlrq8RWvad2MwHmPo82qM8wZsPJYPuY",
    authDomain: "daar-e49b3.firebaseapp.com",
    databaseURL: "https://daar-e49b3.firebaseio.com",
    projectId: "daar-e49b3",
    storageBucket: "daar-e49b3.appspot.com",
    messagingSenderId: "1098553787855",
    appId: "1:1098553787855:web:6c1270290e99d859577eba",
    measurementId: "G-SQ9F4PX4LW"
  };
  firebase.initializeApp(firebaseConfig);
  var ref = firebase.database().ref();
  ref.child("test").once("value").then(function(snapshot) {
    var test = snapshot.val(); 
    console.log(test);
 });
  //dbRefObject.on('value',snap => console.log(snap.val()));

}());