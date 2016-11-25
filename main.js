/*
 * this file contains the core logic for
 * all functionality across the entire web app
 */


// Initialize Firebase

var config = {
	apiKey: "AIzaSyDqOPOax1btNYcOGKmr3HMU7m4SoUub5g4",
	authDomain: "filestorage-bf7b3.firebaseapp.com",
	databaseURL: "https://filestorage-bf7b3.firebaseio.com",
	storageBucket: "filestorage-bf7b3.appspot.com",
	messagingSenderId: "436441417686"
};

firebase.initializeApp(config);


// create a handle to the Firebase real-time database
var database = firebase.database();

// create a handle to the Firebase Authentication service
var auth = firebase.auth();


// a reference to the root of the database
var rootRef  = database.ref();


// a reference to the current transfer session
var sessionRef;

// reference to the currently logged-in user
var currentUser;



function padWithLeadingZeros(numStr)
{
	while (numStr.length < 6)
	{
		numStr = "0" + numStr
	}

	return numStr;
}



function createSession()
{

	var currentSessionId = String(Math.floor(Math.random() * 1000000));

	currentSessionId = padWithLeadingZeros(currentSessionId);

	// save the reference to the new transfer session
	sessionRef = rootRef.child(currentSessionId);

	sessionRef.push("Hello!"); // dummy code

}



function joinSession()
{
	//console.log("hello from joinSession!");
}



$( document ).ready(function() {

	// spawn a login message, just for the sake of testing the app

	var googleProvider = new firebase.auth.GoogleAuthProvider();

	auth.signInWithPopup(googleProvider).then(function(result) {

		currentUser = result.user;

		//console.log(currentUser); // dummy code

	});

	$("#create-button").on("click", createSession);

	$("#join-button").on("click", joinSession);

});

