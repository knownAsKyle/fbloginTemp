var config = {
    apiKey: "AIzaSyAvaxQhFbVTGy0RkyGmVmO73njANsF3WNM",
    authDomain: "temp-74a63.firebaseapp.com",
    databaseURL: "https://temp-74a63.firebaseio.com",
    storageBucket: "temp-74a63.appspot.com",
};
var uiConfig = {
    'signInSuccessUrl': '/',
    'signInOptions': [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
};
var app = firebase.initializeApp(config);
var db = app.database();
var auth = app.auth();
var ui = new firebaseui.auth.AuthUI(auth);
var changeNameButton = document.getElementById("changeNameButton");
changeNameButton.addEventListener("click", handleChangeNameButtonClick)
var loginWrapper = document.getElementById("loginWrapper");
var loginCancelButton = document.getElementById("loginCancelButton");
loginCancelButton.addEventListener("click", handleCancelButtonClick);

function handleChangeNameButtonClick() {
    db.ref("/notes/" + auth.currentUser.uid).push({
        "title": "new Note",
        "timestamp": new Date().toString()
    })
}

function handleCancelButtonClick() {
    loginWrapper.style.opacity = 0;
}
var loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", handleLoginButtonClick);

function handleLoginButtonClick() {
    loginWrapper.style.opacity = 1;
    ui.start('#firebaseLoginUi', uiConfig);
}
auth.onAuthStateChanged(function(user) {
    console.log(user.uid, " = ", user.email);
    db.ref("/users/" + user.uid).set({
        "name": (user.displayName || "user"),
        "email": user.email
    });
    db.ref("/users/" + auth.currentUser.uid).on("value", function(data) {
        console.log("USERS");
        console.log(data.val());
    });
    db.ref("/notes/" + auth.currentUser.uid).on("value", function(data) {
        console.log("NOTES");
        console.log(data.val());
    });
});