let ActiveDirectory = require('activedirectory');

class Notification{
    constructor(name, type = "success", message, dismissable=true){
        this.name = name;
        this.type = type;   //bootstrap alerts: success, info, warning, danger
        this.alertModifier = "alert-" + type;
        this.message = message;
        this.dismissable = dismissable;
    }
    
}

//Main logic
let appModel = new AppViewModel();
ko.applyBindings(appModel);

function AppViewModel() {
    this.school = ko.observable("Technology Services");
    this.sections = ["login", "apps"]
    this.currentSection = ko.observable("login");

    this.username = ko.observable();
    this.password = ko.observable();
    this.user = ko.observable();
    this.loggedIn = false;
    
    this.notifications = ko.observableArray();
    this.removeNotification = (notification)=>{
        this.notifications.remove(notification);
    }

}

function login() {
    //Boilerplate Config
    let username = appModel.username();
    let password = appModel.password();
    let config = {
        url: 'ldap://rams.adp.vcu.edu',
        baseDN: 'dc=rams, dc=ADP, dc=vcu, dc=edu',
        username: "RAMS\\" + username,
        password: password
    };
    let ad = new ActiveDirectory(config);
    //Get User Info
    ad.findUser(username, function (err, user) {
        if (err) {
            let error = "Invalid Credentials"
            appModel.notifications.removeAll();
            appModel.notifications.push(new Notification("Login Error", "danger", error));
            return;
        }
        console.log(username + ': ');
        console.log(user);
        //Parse DN
        let DN = user.dn.split(",");
        for(let piece of DN){
            let subpieces = piece.split("=")
            let type = subpieces[0];
            let value = subpieces[1];
            if(user[type] === undefined){
                user[type] = [value];
            }
            else{
                user[type].push(value);
            }
        }
        appModel.school(user.OU[user.OU.length-1]);
        console.log(user);
        appModel.user(user);
        appModel.currentSection('apps');
    });
}



function showNotification(elem){
    $(elem).collapse('show');
}
function hideNotification(elem){
    $(elem).collapse('hide');
}