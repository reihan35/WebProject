
var functions = firebase.functions()

function test_backend() {
    console.log("SCRIPT TEST")

    var my_test = firebase.functions().httpsCallable('myTest');
    let hello_world = my_test().then(function(result) {
        console.log(result.data);
    });

}

test_backend()