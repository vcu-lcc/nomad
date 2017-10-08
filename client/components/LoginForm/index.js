/*
    Copyright (C) 2017 Darren Chan

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
// Import ReactJS and React-DOM
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ActiveDirectory from 'activedirectory';
// Import react-desktop elements
import {
    Button,
    Label,
    ProgressCircle,
    Text,
    TextInput,
    View
} from 'react-desktop/windows';

class API {
    constructor() {
        this.currentSession = null;
    }
    authenticate(_credentials) {
        return new Promise((resolve, reject) => {
            const currentSession = new ActiveDirectory({
                url: 'ldap://rams.adp.vcu.edu',
                baseDN: 'dc=rams,dc=ADP,dc=vcu,dc=edu',
                username: 'RAMS\\' + _credentials.username,
                password: _credentials.password
            });
            currentSession.findUser(_credentials.username, (err, auth) => {
                if (auth) {
                    resolve({
                        details: auth,
                        credentials: _credentials,
                        session: currentSession
                    });
                } else {
                    reject({
                        details: err,
                        credentials: _credentials,
                        session: currentSession
                    });
                }
            });
        });
    }
}

module.exports = class ActiveDirectoryLoginForm extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loading: false,
            error: false,
            errorBackground: false,
            success: false,
            transitionEnd: null
        };
        this.username = '';
        this.password = '';
        this.api = new API();
    }

    submit() {
        this.setState({
            loading: true
        });
        this.api.authenticate({
            username: this.username,
            password: this.password
        }).then((details) => {
            this.setState({
                loading: false,
                success: true,
                error: false,
                transitionEnd: () => {
                    this.props.finish({
                        ...details
                    });
                }
            });
        }).catch((details) => {
            this.setState({
                errorBackground: false
            });
            setTimeout(() => {
                this.setState({
                    loading: false,
                    error: true,
                    errorBackground: true
                });
            }, 0);
            this.props.postMessage(details);
        });
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
                        }

                        .fadein {
                            opacity: .9 !important;
                        }
                    `}
                </style>
                <div
                    className={this.state.success ? 'fadein' : ''}
                    onTransitionEnd={this.state.transitionEnd}
                    style={{
                        pointerEvents: this.state.success ? 'all' : 'none',
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        background: 'white',
                        zIndex: '1',
                        opacity: '0',
                        display: 'flex',
                        transition: 'opacity 500ms ease-in-out'
                    }}
                >
                    <div
                        className={this.state.success ? 'slidedown fadein' : ''}
                        onTransitionEnd={e => e.stopPropagation()}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            zIndex: '1',
                            opacity: '0',
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
                                src={require("./check.png")}
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
                </div>
                <img
                    src={require("./University.png")}
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
                        onKeyDown={e => {
                          if (e.key == 'Enter') {
                            this.submit();
                          }
                        }}
                    >
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
                            onClick={this.submit.bind(this)}
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
                                {
                                    this.state.loading ? <ProgressCircle size={25} /> : null
                                }
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
};