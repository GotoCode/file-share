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

// create a handle to the Firebase Storage service
var storage = firebase.storage();

// create a handle to the Firebase Authentication service
var auth = firebase.auth();


// a reference to the root of the database
var rootRef  = database.ref();


// the current session id in use
var currentSessionId;

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



function isValidSession(sessionId)
{
	for (var i = 0; i < sessionId.length; i++)
	{
		if ("0123456789".indexOf(sessionId[i]) < 0)
		{
			return false;
		}
	}

	return (sessionId.length == 6);
}



function createSession()
{

	currentSessionId = String(Math.floor(Math.random() * 1000000));

	currentSessionId = padWithLeadingZeros(currentSessionId);

	// save the reference to the new transfer session
	sessionRef = rootRef.child(currentSessionId);

	/*sessionRef.on("child_added", function(snapshot) {

			console.log(snapshot.val()); // dummy code

		});*/

	/*
	weather = ["sunny", "rainy", "cloudy"]; // dummy code

	sessionRef.push("Hello from " + currentSessionId + "!"); // dummy code
	sessionRef.push("It's nice and " + weather[Math.floor(Math.random() * 3)] + " over here!"); // dummy code
	*/

	// switch UI control to the file transfer page
	
	$("#index-top").fadeOut();
	$("#share-top").fadeIn();

	// update the session ID field
	document.getElementById("session-id").innerHTML = currentSessionId;

	sessionRef.on("child_added", function(snapshot) {

		//console.log(snapshot.val()); // dummy code

		var value = snapshot.val();

		var listNode = document.createElement("li");

		listNode.innerHTML = "<span> <a href='" + value.downloadURL + "' target='_blank'>" + value.filename + "</a> </span>";

		$("#files-list").append(listNode);

		/*snapshot.forEach(function(childSnapshot) {

			console.log(childSnapshot.val()); // dummy code

		});*/

	});

	console.log(currentSessionId); // dummy code

}



function joinSession()
{
	//console.log("hello from joinSession!");

	currentSessionId = String($("#session-field").val());

	if (isValidSession(currentSessionId))
	{
		sessionRef = rootRef.child(currentSessionId);

		// switch UI control to the file transfer page

		$("#index-top").fadeOut();
		$("#share-top").fadeIn();

		// update the session ID field
		document.getElementById("session-id").innerHTML = currentSessionId;

		sessionRef.on("child_added", function(snapshot) {

			//console.log(snapshot.val()); // dummy code

			var value = snapshot.val();

			console.log(value);

			var listNode = document.createElement("li");

			listNode.innerHTML = "<span> <a href='" + value.downloadURL + "' target='_blank'>" + value.filename + "</a> </span>";

			$("#files-list").append(listNode);

			/*snapshot.forEach(function(childSnapshot) {

				console.log(childSnapshot.val()); // dummy code

			});*/

		});
	}

}


function uploadFile()
{
	var fileSelect = document.getElementById("file-upload");

	// reference to the bucket that stores this file
	var bucketRef = storage.ref(currentSessionId + "/" + currentUser.uid + "/" + fileSelect.files[0].name);

	// upload the file to Google Storage...
	// ...then push a new message to Firebase Realtime Database
	
	bucketRef.put(fileSelect.files[0]).then(function(snapshot) {

		var newMessageRef = sessionRef.push();

		newMessageRef.set({
			downloadURL : snapshot.downloadURL,
			filename    : fileSelect.files[0].name
		});

	});

	console.log(currentUser.uid);     // dummy code
	console.log(fileSelect.files[0]); // dummy code
}



$( document ).ready(function() {

	// spawn a login message, just for the sake of testing the app

	console.log(auth.currentUser); // dummy code

	if (auth.currentUser === null)
	{
		var googleProvider = new firebase.auth.GoogleAuthProvider();

		auth.signInWithPopup(googleProvider).then(function(result) {

			currentUser = result.user;

			//console.log(currentUser); // dummy code

		});
	}

	$("#create-button").on("click", createSession);

	$("#join-button").on("click", joinSession);

});

