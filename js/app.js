let ActiveDirectory = require('activedirectory');
class Notification {
    constructor(name, type = "success", message, dismissable = true) {
        this.name = name;
        this.type = type;   //Bootstrap alerts: success, info, warning, danger
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
    this.user = ko.observable({ displayName: "" });
    this.loggedIn = false;

    this.computerLocations = {
        "MPC": {
            "HIB":["100","200","300","333","356","347","361","400","500"],
            "ALC":["1001","1200","1407","2010","2020","2035","3003","3050","3052","4001","4010","4050"],
            "TAB":["108","202","312","412"],
            "CAB":["B46"]
        },
        "MVC": {
            "SAN":["288","289","290","299","300","301","314","420","451","521","576","600","601"],
            "VMI":["100","121"]
        }
    };
    // [
    //     {
    //         name: "MPC",
    //         buildings: [
    //             {
    //                 name: "HIB",
    //                 rooms: ["100","200","300","333","356","347","361","400","500"]
    //             },
    //             {
    //                 name: "ALC",
    //                 rooms: ["1001","1200","1407","2010","2020","2035","3003","3050","3052","4001","4010","4050"]
    //             },
    //             {
    //                 name: "TAB",
    //                 rooms: ["108","202","312","412"]
    //             },
    //             {
    //                 name: "CAB",
    //                 rooms: ["B46"]
    //             }
    //         ]
    //     },
    //     {
    //         name: "MCV",
    //         buildings: [
    //             {
    //                 name: "SAN",
    //                 rooms: ["288","289","290","299","300","301","314","420","451","521","576","600","601"]
    //             },
    //             {
    //                 name: "VMI",
    //                 rooms: ["100","121"]
    //             }
    //         ]
    //     }
    // ];
    this.computerTypes = ["Lab Computer", "Podium Computer"];

    this.campus = ko.observable("MPC");
    this.building = ko.observable();
    this.room = ko.observable();
    this.number = ko.observable();

    this.campus.subscribe((newValue)=>$('.selectpicker').selectpicker('render'));

var observer = new MutationObserver(function(mutations) {
	// For the sake of...observation...let's output the mutation to console to see how this all works
	mutations.forEach(function(mutation) {
		console.log(mutation);
	});    
});

    this.notifications = ko.observableArray();
    this.removeNotification = (notification) => {
        this.notifications.remove(notification);
    }

}
$("body").on("click", ".bootstrap-select",function(){
    console.log("refresh");
    $('.selectpicker').selectpicker('refresh');
});

function login() {
    appModel.notifications.removeAll();
    //Boilerplate config
    let username = appModel.username();
    let password = appModel.password();
    let config = {
        url: 'ldap://rams.adp.vcu.edu',
        baseDN: 'dc=rams, dc=ADP, dc=vcu, dc=edu',
        username: "RAMS\\" + username,
        password: password
    };
    let ad = new ActiveDirectory(config);
    //Get user info
    ad.findUser(username, function (err, user) {
        if (err) {
            console.log(err);
            let error = "Invalid Credentials"
            appModel.notifications.push(new Notification("Login Error", "danger", error));
            return;
        }
        //Parse DN
        let DN = user.dn.split(",");
        for (let piece of DN) {
            let subpieces = piece.split("=")
            let type = subpieces[0];
            let value = subpieces[1];
            if (user[type] === undefined) {
                user[type] = [value];
            }
            else {
                user[type].push(value);
            }
        }
        //Update model
        appModel.school(user.OU[user.OU.length - 1]);
        appModel.user(user);
        console.log(user);
        appModel.currentSection('apps');
    });
    // //Attempt to find groups
    // ad.findGroup(groupName, function (err, group) {
    //     if (err) {
    //         console.log('ERROR: ' + JSON.stringify(err));
    //         return;
    //     }

    //     if (!group) console.log('Group: ' + groupName + ' not found.');
    //     else {
    //         console.log(group);
    //         console.log('Members: ' + (group.member || []).length);
    //     }
    // });

}
function infiniteRefresh(){
    refreshSelects();
    setTimeout(infiniteRefresh(),1000);
}
function refreshSelects(){
    console.log("refresh");
    $('.selectpicker').selectpicker('refresh');
}

function showNotification(elem) {
    $(elem).collapse('show');
}
function hideNotification(elem) {
    $(elem).collapse('hide');
}