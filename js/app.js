const ActiveDirectory = require('activedirectory');
const StringDecoder = require('string_decoder').StringDecoder;
const exec = require('child_process').execSync;
const xml2js = require('xml2js');
const elevator = require('elevator');
const Sudoer = require('electron-sudo').default;

let sudoerOptions = {name: 'elevate application'},
    sudoer = new Sudoer(sudoerOptions);


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

//lab numbering L00-L99
//with lab numbering get rid of dash

function AppViewModel() {
    this.school = ko.observable("Technology Services");
    this.sections = ["login", "apps"]
    this.currentSection = ko.observable("login");

    //Computer Make, Model, and Mac

    let lines = exec('wmic computersystem get model,name,manufacturer,systemtype').toString('utf8');
    console.log(lines);
    lines = lines.replace(/\s+$/, "").replace(/\s+\n/, "\n").split(/\n/).map(line => line.split(/\s{2,}/));
    let systemInfo = {};
    for (let i = 0; i < lines[0].length; i++) {
        systemInfo[lines[0][i].toLowerCase()] = lines[1][i];
    }
    console.log(systemInfo);
    this.systemInfo = ko.observable(systemInfo);

    //Computer Type Buttons
    this.computerType = ko.observable();

    //Naming Forms format(boolean for enabling/disabling): [campus,building,room,floor,physicalLocation,computerNumber];
    this.namingFormsEnabled = ko.observable({
        faculty: true,
        campus: true,
        building: true,
        room: true,
        floor: true,
        physicalLocation: true,
        computerNumber: true
    });
    //http://davidarvelo.com/blog/array-number-range-sequences-in-javascript-es6/
    this.floors = Array.from(Array(100).keys());
    this.physicalLocations = ["Lobby", "Hallway", "Elevator"];
    this.computerNumbers = Array.from(Array(100).keys());

    this.username = ko.observable();
    this.password = ko.observable();
    this.user = ko.observable({ displayName: "" });
    this.loggedIn = false;

    this.computerLocations = {
        "MPC": {
            "HIB": ["100", "200", "300", "333", "356", "347", "361", "400", "500"],
            "ALC": ["1001", "1200", "1407", "2010", "2020", "2035", "3003", "3050", "3052", "4001", "4010", "4050"],
            "TAB": ["108", "202", "312", "412"],
            "CAB": ["B46"]
        },
        "MVC": {
            "SAN": ["288", "289", "290", "299", "300", "301", "314", "420", "451", "521", "576", "600", "601"],
            "VMI": ["100", "121"]
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

    this.computerUser = ko.observable({ initials: "" });
    this.possibleUsers = ko.observable([]);
    this.possibleUsersOptions = ko.observable([]);

    this.campus = ko.observable("MPC");
    this.building = ko.observable();
    this.room = ko.observable();
    this.floor = ko.observable();
    this.physicalLocation = ko.observable();
    this.computerNumber = ko.observable();

    this.feeds = ko.observableArray([]);


    this.computerName = ko.computed(() => {
        switch (this.computerType()) {
            case "Faculty/Staff":
                return this.campus() + "-" + this.building() + "-" + this.room() + "-" + leftPad(this.computerNumber());
            case "Lab/Classroom":
                return this.campus() + this.building() + this.room() + "-" + "L" + leftPad(this.computerNumber());
            case "Kiosk":
                return this.campus() + this.building() + this.floor() + this.physicalLocation() + "-" + "K" + leftPad(this.computerNumber(), 1);
            case "Digital Signage":
                return this.campus() + this.building() + this.floor() + this.physicalLocation() + "-" + "C" + leftPad(this.computerNumber(), 1);
        }
    });

    this.campus.subscribe((newValue) => $('.selectpicker').selectpicker('render'));

    var observer = new MutationObserver(function (mutations) {
        // For the sake of...observation...let's output the mutation to console to see how this all works
        mutations.forEach(function (mutation) {
            console.log(mutation);
        });
    });

    this.notifications = ko.observableArray();
    this.removeNotification = (notification) => {
        this.notifications.remove(notification);
    }
    this.togglePackageSelected = (data, event) => {
        console.log(data);
        console.log(event);
        if (event.toElement.type != "checkbox")
            data.checked(!data.checked());
        return true;
    }

}

//Listeners
$("body").on("click", ".bootstrap-select", function () {
    console.log("refresh");
    $('.selectpicker').selectpicker('refresh');
});
$("#computerType").on("click", "button", function () {
    let computerType = $(this).text();
    $("#computerType").find("button").each(function () {
        $(this).removeClass("btn-ts-dark");
    });
    $(this).addClass("btn-ts-dark");
    appModel.computerType(computerType);

    switch (computerType) {
        case "Faculty/Staff":
            appModel.namingFormsEnabled({
                faculty: true,
                campus: false,
                building: false,
                room: false,
                floor: false,
                physicalLocation: false,
                computerNumber: true
            });
            break;
        case "Lab/Classroom":
            appModel.namingFormsEnabled({
                faculty: false,
                campus: true,
                building: true,
                room: true,
                floor: false,
                physicalLocation: false,
                computerNumber: true
            });
            break;
        case "Kiosk":
            appModel.namingFormsEnabled({
                faculty: false,
                campus: true,
                building: true,
                room: false,
                floor: true,
                physicalLocation: true,
                computerNumber: true
            });
            break;
        case "Digital Signage":
            appModel.namingFormsEnabled({
                faculty: false,
                campus: true,
                building: true,
                room: false,
                floor: true,
                physicalLocation: true,
                computerNumber: true
            });
            break;
    }

});
$("#eidSearch").on("keyup", "input", _.debounce(searchUsers, 500));
$("#eidSearch").on("keyup", "input", _.debounce(searchUsers, 500));

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
    //Let's grab stuff from Nuget
    $.get("http://nuget.ts.vcu.edu/api/json/Feeds_GetFeeds?API_Key=3oVZdk5YgxWJw36s4jqG6S22UbRUK43p", (feedList) => {
        feedList.forEach((feed) => {
            feed.packages = [];
            $.get("http://nuget.ts.vcu.edu/api/json/NuGetPackages_GetPackages?API_Key=3oVZdk5YgxWJw36s4jqG6S22UbRUK43p&Feed_Id=" + feed.Feed_Id, (feedData) => {
                feedData.forEach((data, index) => {
                    let xml = atob(data.NuspecFile_Bytes);
                    xml = xml.substring(xml.indexOf("<"));
                    xml2js.parseString(xml, (err, parsedData) => {
                        let metadata = parsedData.package.metadata[0];
                        data["title"] = metadata.title ? metadata.title[0] : data.Package_Id;
                        data["description"] = metadata.description[0];
                        data["iconUrl"] = metadata.iconUrl ? metadata.iconUrl[0] : "http://nuget.ts.vcu.edu/resources/images/icons/package-chocolatey.svg";
                        data["checked"] = false;
                    });
                    feed.packages.push(data);
                });
                appModel.feeds.push(ko.mapping.fromJS(feed));
            });
        });
        console.log(appModel.feeds());
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

function searchUsers() {

    let element = this;
    $(element).after('<span class="selectpicker-loading"></span>');
    console.log("searching");
    let username = appModel.username();
    let password = appModel.password();
    let config = {
        url: 'ldap://rams.adp.vcu.edu',
        baseDN: 'dc=rams, dc=ADP, dc=vcu, dc=edu',
        username: "RAMS\\" + username,
        password: password
    };
    let ad = new ActiveDirectory(config);

    let checkUsername = $(this).val();
    if (checkUsername == "") {
        $("#usernameCheck").removeClass("has-success has-error");
        appModel.possibleUsers([]);
        appModel.possibleUsersOptions([]);
        $('.selectpicker').selectpicker('refresh');
        $(element).siblings().remove();
        return;
    }

    for (let possibleUser in possibleUsers) {
        if (checkUsername.toLowerCase() == possibleUser.cn.toLowerCase()) {
            possibleUser.initials = possibleUser.givenName[0];

            possibleUser.initials += possibleUser.sn[0];
            appModel.computerUser = ko.mapping.fromJS(possibleUser);
        }
    }

    let query = "cn=" + checkUsername + "*";
    console.log("query: " + query);
    ad.findUsers(query, function (err, users) {
        if (err) {
            console.log("error " + err);
            $("#usernameCheck").addClass("has-error").removeClass("has-success");
            $(element).siblings().remove();
            return;
        }
        console.log("no error");
        if (users == undefined) {
            $("#usernameCheck").addClass("has-error").removeClass("has-success");
            $(element).siblings().remove();
            return;
        }
        console.log(users);
        let usersObject = {};
        users.forEach(function (data) {
            usersObject[data.cn] = data;
        });
        appModel.possibleUsers(usersObject);
        appModel.possibleUsersOptions(Array.from(users, user => user.cn));
        $(element).siblings().remove();
        $('.selectpicker').selectpicker('refresh');
        $("#usernameCheck").addClass("has-success").removeClass("has-error");
    });
}
function leftPad(padee, length = 2, padChar = 0) {
    if (padee == undefined)
        return;
    padee = padee + "";
    let diff = length - padee.length;
    if (diff <= 0)
        return padee;
    let pad = "";
    for (let i = 0; i < diff; i++)
        pad += padChar;
    return pad + padee;
}
function showNotification(elem) {
    $(elem).collapse('show');
}
function hideNotification(elem) {
    $(elem).collapse('hide');
}
function installPackagesChoco() {
    let count = 0;
    let commands = [];
    appModel.feeds().forEach(feed => {
        let command = ["choco install ", " -s  https://nuget.ts.vcu.edu/nuget/", " -y -r --failstderr --allow-empty-checksums"];
        let packages = [];
        feed.packages().forEach(pkg => {
            if (pkg.checked())
                packages.push(pkg.Package_Id());
        });
        if (packages.length > 0) {
            command[0] += packages.join(" ");
            command[1] += feed.Feed_Name();
            console.log(command.join(""));
            count++;
            // commands.push("start /wait " + command.join("") + " &");
            sudoer.spawn(command.join("")).then(function (cp) {
                console.group(feed.Feed_Name());
                console.log(cp.output);
                console.groupEnd();
                cp.on('close', () => { console.log(feed.Feed_Name() + " successfully installed")});
            /*
                cp.output.stdout (Buffer)
                cp.output.stderr (Buffer)
            */
            });
            // elevator.execute(command.join(""), {
            //     terminating: true,
            //     waitForTermination: true,
            //     doNotPushdCurrentDirectory: true,
            //     unicode: true
            // }, function (error, stdout, stderr) {
            //     debugger;
            //     if (error) {
            //         throw error;
            //     }

            //     console.log(stdout);
            //     console.log(stderr);
            // });
        }
    });
    //After installs are complete, email C:\ProgramData\chocolatey\logs\chocolatey.log to some email.

}