// Import ReactJS and React-DOM
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// Import react-desktop elements
import {
    Button,
    Label,
    ProgressCircle,
    Text,
    TextInput,
    View
} from 'react-desktop/windows';

module.exports = (function(model, view, controller) {
    model = {
        ActiveDirectory: require('activedirectory'),
        currentSession: null,
        init: function() {
        },
        verify: function(details) {
            model.currentSession = new model.ActiveDirectory({
                url: 'ldap://rams.adp.vcu.edu',
                baseDN: 'dc=rams, dc=ADP, dc=vcu, dc=edu',
                username: 'RAMS\\' + details.username,
                password: details.password
            });
            model.currentSession.findUser(details.username, function(err, auth) {
                if (auth) {
                    details.callback({
                        success: true,
                        details: auth,
                        session: model.currentSession
                    });
                } else {
                    details.callback({
                        successful: false,
                        details: err
                    });
                }
            });
        }
    };

    controller = {
        promise: {
            resolve: null,
            reject: null
        },
        init: function(props) {
            model.init(props);
            view.init(props);
            return new Promise(function(resolve, reject) {
                controller.promise.resolve = resolve;
                controller.promise.reject = reject;
            });
        },
        verifyIdentity: function(details) {
            model.verify(details);
        },
        assertError: function(obj) {
            controller.promise.reject(obj);
        },
        resolve: function(obj) {
            controller.promise.resolve(obj);
        }
    };

    view = {
        init: function(props) {
            view.getLogin(props.parentElement, function(props) {
                /*
                    This function gets called asynchronously, after the user clicks the submit button.
                    At this point, props includes a username, password, and callback (used for providing
                    validation back)
                */
                props.callbacks.push(function(details) {
                    if (details.success) {
                        view.finish.call(this, function() {
                            controller.resolve({
                                user: details.details,
                                session: details.session
                            });
                        });
                    } else {
                        controller.assertError({
                            details: details.details
                        });
                    }
                });
                controller.verifyIdentity(props);
            });
        },
        getLogin: function(parentElement, callback) {
            /*
                Asynchronous function that prompts the user an embedded form for login credentials,
                then passes back an object containing username and password for function callback.
            */
            let submit = function() {
                this.setState({
                    loading: true
                });
                let params = {
                    username: this.username,
                    password: this.password,
                    callbacks: []
                };
                params.callbacks.push(function(result) {
                    if (result.success) {
                        this.setState({
                            loading: false,
                            error: false
                        });
                    } else {
                        this.setState({
                            errorBackground: false
                        });
                        setTimeout(function() {
                            this.setState({
                                loading: false,
                                error: true,
                                errorBackground: true
                            });
                        }.bind(this), 0);
                    }
                }.bind(this));
                params.callback = function() {
                    let args = arguments;
                    params.callbacks.forEach(function(i) {
                        i.apply(this, args);
                    }.bind(this));
                }.bind(this);
                callback(params);
            };
            class LoginFragment extends React.Component {
                constructor() {
                    super();
                    this.state = {
                        loading: false,
                        error: false,
                        errorBackground: false,
                        success: false,
                        finishedCallback: null
                    };
                    this.username = '';
                    this.password = '';
                }

                render() {
                    return (
                        <View
                            verticalAlignment="center"
                            horizontalAlignment="center"
                        >
                            <style>
                                {`
                                    .background-fade {
                                        background: none !important;
                                    }

                                    .slidedown {
                                        transform: translateY(0) !important;
                                        opacity: .9 !important;
                                    }
                                `}
                            </style>
                            <div
                                className={this.state.success ? 'slidedown' : ''}
                                onTransitionEnd={this.state.finishedCallback}
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    background: 'white',
                                    zIndex: '1',
                                    opacity: '0.1',
                                    display: 'flex',
                                    transition: 'transform 500ms ease-in-out, opacity 500ms ease-in-out',
                                    transform: 'translateY(-100%)'
                                }}
                            >
                                <Label
                                    verticalAlignment="center"
                                    horizontalAlignment="center"
                                    height="100%"
                                    width="100%"
                                >
                                    <img
                                        src="images/check.png"
                                        height="60px"
                                        width="60px"
                                        draggable={false}
                                        style={{
                                            padding: '10px',
                                            userSelect: 'none',
                                            WebkitUserDrag: 'none'
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: 'x-large'
                                        }}
                                    >
                                        Login Successful
                                    </span>
                                </Label>
                            </div>
                            <img
                                src="images/vcu.png"
                                height="130px"
                                width="130px"
                                draggable={false}
                                onClick={() => location.reload()}
                                style={{
                                    padding: '10px',
                                    borderRight: 'solid #EEEEEE 1px',
                                    userSelect: 'none',
                                    WebkitUserDrag: 'none'
                                }}
                            />
                            <View
                                padding="10px"
                                layout="vertical"
                            >
                                <div
                                    style={{
                                        padding: '5px' // These are workarounds, so that Radium doesn't complain
                                    }}
                                >
                                    <Label>
                                        <span
                                            style={{
                                                fontSize: '16px',
                                                fontWeight: '600'
                                            }}
                                        >
                                            Enterprise Login
                                        </span>
                                    </Label>
                                </div>
                                <div
                                    style={{
                                        maxHeight: '40px',
                                        padding: '5px 5px 0 5px' // These are workarounds, so that Radium doesn't complain
                                    }}
                                >
                                    <TextInput
                                        placeholder="Username"
                                        width={256}
                                        onChange={e => void(this.username = e.target.value)}
                                    />
                                </div>
                                <div
                                    style={{
                                        maxHeight: '40px',
                                        padding: '5px 5px 0 5px' // These are workarounds, so that Radium doesn't complain
                                    }}
                                >
                                    <TextInput
                                        password={true}
                                        placeholder="Password"
                                        width={256}
                                        onChange={e => void(this.password = e.target.value)}
                                    />
                                </div>
                                <div
                                    style={{
                                        marginTop: '10px',
                                        marginRight: '5px',
                                        marginBottom: '5px',
                                        marginLeft: '5px',
                                        display: 'flex',
                                        flexDirection: 'row-reverse'
                                    }}
                                >
                                    <Button
                                        type="submit"
                                        onClick={submit.bind(this)}
                                    >
                                        Sign in
                                    </Button>
                                    <div
                                        style={{
                                            paddingLeft: '8px',
                                            paddingRight: '8px',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <View
                                            horizontalAlignment="center"
                                            verticalAlignment="center"
                                        >
                                            <ProgressCircle
                                                hidden={!this.state.loading}
                                                size={25}
                                            />
                                        </View>
                                    </div>
                                    <div
                                        style={{
                                            flexGrow: '1',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div
                                            style={{
                                                background: '#FFCCCC',
                                                paddingLeft: '10px',
                                                paddingRight: '10px',
                                                borderRadius: '3px',
                                                transition: this.state.errorBackground ? 'background 500ms ease-out' : ''
                                            }}
                                            className={this.state.errorBackground ? 'background-fade' : ''}
                                        >
                                            <Label
                                                hidden={!this.state.error}
                                                color="#FF0033"
                                            >
                                                Login Failure
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            </View>
                        </View>
                    );
                }
            }

            ReactDOM.render(<LoginFragment></LoginFragment>, parentElement);
        },
        finish: function(callback) {
            this.setState({
                success: true,
                finishedCallback: callback
            });
        }
    };
    return controller.init;
})();