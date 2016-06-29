var DataBase = (function() {
    function DataBase(config) {
        this.config = config || {
            apiKey: "AIzaSyAvaxQhFbVTGy0RkyGmVmO73njANsF3WNM",
            authDomain: "temp-74a63.firebaseapp.com",
            databaseURL: "https://temp-74a63.firebaseio.com",
            storageBucket: "temp-74a63.appspot.com",
        };
        this.db = firebase.apps.length ? firebase.apps[0].database() : firebase.initializeApp(this.config).database();
    }
    DataBase.prototype.get = function(loc, cb) {
        this.db.ref(loc).once("value", cb);
    };
    DataBase.prototype.update = function(loc, data) {
        this.db.ref(loc).set(data);
    };
    return DataBase;
})();