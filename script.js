/*GOOGLE PLACES */
var mapOptions = {
    bounds: new google.maps.LatLngBounds({
        lat: 43.0389,
        lng: 87.9065
    }),
    types: ['(cities)'],
    componentRestrictions: {
        country: "us"
    }
};
var loc = document.getElementById("loction");
var profile__location = document.getElementById("profile__location");
var autocomplete = new google.maps.places.Autocomplete(profile__location, mapOptions);
autocomplete.addListener('place_changed', handleLocationChange);

function handleLocationChange() {
    var place = autocomplete.getPlace();
    var profile__eatery_options = {};
    profile__eatery_options.types = ["establishment"];
    profile__eatery_options.bounds = new google.maps.LatLngBounds(place.geometry.location);
    profile__eatery_options.componentRestrictions = {
        country: "us"
    };
    autocomplete_eatery.setOptions(profile__eatery_options);
    loc.innerHTML = place.formatted_address;
    console.log(place);
}
var profile__eatery = document.getElementById("profile__eatery");
var autocomplete_eatery = new google.maps.places.Autocomplete(profile__eatery);
autocomplete_eatery.addListener('place_changed', handleEateryChange);

function handleEateryChange() {
    var place = autocomplete_eatery.getPlace();
    console.log(place)
}
/*FIREBASE HOOK*/
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
auth.onAuthStateChanged(function(user) {
    console.log(user.uid, " = ", user.email, auth.currentUser);
    if (auth.currentUser) {
    	profileButton.innerHTML = (user.displayName || user.email);
        db.ref("/users/" + user.uid).set({
            "name": (user.displayName || "user"),
            "email": user.email
        });
    }else{
    	profileButton.innerHTML = "login";
    }
});
var profile__vote = document.getElementById("profile__vote");
profile__vote.addEventListener("click", handleVoteClick);

function handleVoteClick() {
    var place = autocomplete_eatery.getPlace();
    console.log("current palce below, current cat: ", profile_categories.value)
    console.dir(place);
    var userRefv = db.ref("/users/" + auth.currentUser.uid + "/" + profile_categories.value + "/" + place.place_id);
    console.dir(userRefv)
    userRefv.set({
        placeName: place.name,
        timestamp: new Date().toString()
    });
    db.ref("/votes/" + profile_categories.value + "/" + place.place_id).update({
        voterID: auth.currentUser.uid,
        voterName: auth.currentUser.displayName || auth.currentUser.email,
        timestamp: new Date().toString(),
        placeName: place.name,
    }).then(function(data){
    	profile.style.height =  null;
    });
}
var results = document.getElementById("results");

function handleVoteChange(data) {
    console.log("VOTES!")
    results.innerHTML = "";
    if (data.val()) {
        data.forEach(function(child) {
            var tempElement = results.querySelector("#" + child.getKey());
            if (!tempElement) {
                tempElement = document.createElement("div");
                tempElement.className = "result";
                tempElement.id = child.getKey();
                tempElement.innerHTML = child.val().placeName + " : by  " + child.val().voterName;
                results.appendChild(tempElement)
            } else {}
            console.log(child.getKey(), child.val())
        });
    }
}
/*CATEGORY DROP DOWNS*/
var categoriesList = {};
categoriesList.pizza = {
    "name": "PIZZA!!!"
};
categoriesList.tacos = true;
categoriesList.breakfast = {
    "selected": true
};
categoriesList.dessert = true;
var profileButton = document.getElementById("profileButton");

var profile = document.getElementById("profile");
profileButton.addEventListener("click", handleProfileButton);
var firebaseLoginUi = document.getElementById("firebaseLoginUi");
var logOutButton = document.getElementById("logOutButton")
logOutButton.addEventListener("click",handleLogOutClick);
function handleLogOutClick(){
	auth.signOut().then(function(e){
		profile.style.height = "0px";
		logOutButton.style.top = "20px";
		logOutButton.style.color = "#000";
		logOutButton.style.background = "rgba(0,0,0,0)";
		logOutButton.style.zIndex  = "0";
		
		profileButton.innerHTML = "login";
	});
	
}
function handleProfileButton() {
    if (auth.currentUser) {
        profile.style.height = profile.style.height.length === 0 ? "100%" : null;
        if(profile.style.height){
        	logOutButton.style.top = "70px";
    		logOutButton.style.color = "#fff";
    		logOutButton.style.background = "rgba(0,0,0,.8)";
    		logOutButton.style.zIndex  = "1";
        }else{
        	logOutButton.style.top = "20px";
    		logOutButton.style.color = "#000";
    		logOutButton.style.background = "rgba(0,0,0,0)";
    		logOutButton.style.zIndex  = "0";
        }
    } else {
        firebaseLoginUi.style.height = firebaseLoginUi.style.height === "100px" ? "0px" : "100px";
        ui.start('#firebaseLoginUi', uiConfig);
    }
}
var categories = document.getElementById("categories");
categories.addEventListener("change", handleCategoriesChange)

function handleCategoriesChange() {
    var tempRef;
    if (categories.value) {
        if (tempRef) {
            tempRef.off();
        }
        tempRef = db.ref("/votes/" + categories.value);
        tempRef.on("value", handleVoteChange);
    }
}
handleCategoriesChange();
var profile_categories = document.getElementById("profile_categories");
for (var cat in categoriesList) {
    var option = document.createElement("option");
    option.value = cat;
    option.text = categoriesList[cat].name || cat;
    option.selected = categoriesList[cat].selected;
    categories.appendChild(option);
    profile_categories.appendChild(option.cloneNode(true));
}