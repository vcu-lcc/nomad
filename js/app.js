let ActiveDirectory = require('activedirectory');

class Notification{
    constructor(name, type = "success", message, dismissable=true){
        this.name = name;
        this.type = type;   //bootstrap alerts: success, info, warning, danger
        this.message = message;
        this.dismissable = dismissable;
    }
}

//Main logic
let appModel = new AppViewModel();

ko.applyBindings(appModel);

function AppViewModel() {
    this.school = "Technology Services";
    this.sections = ["login", "apps"]
    this.currentSection = ko.observable("login");

    this.username = ko.observable();
    this.password = ko.observable();
    this.loggedIn = false;
    
    this.notifications = [];

}

function login() {
    let username = appModel.username();
    let password = appModel.password();
    let config = {
        url: 'ldap://rams.adp.vcu.edu',
        baseDN: 'dc=rams, dc=ADP, dc=vcu, dc=edu',
        username: "RAMS\\" + username,
        password: password
    };
    let ad = new ActiveDirectory(config);
    ad.authenticate(username, password, function (err, auth) {
        if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (auth) {
            console.log('Authenticated!');
        }
        else {
            console.log('Authentication failed!');
        }
    });
    // ad.findUser(username, function (err, user) {
    //     if (err) {
    //         console.log('ERROR: ' + JSON.stringify(err));
    //         return;
    //     }
    //     console.log(username + ': ');
    //     console.log(JSON.stringify(user));
    // });
}

function createNotification(name, type, message){

}
function dismissNotification(name){

}
