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
// Import ReactJS
import ActiveDirectory from 'activedirectory';
import LoginForm from './LoginForm';
import { setCredentials, nextStage, setIdentity } from '../../actions';
import { connect } from 'react-redux';

let state = {};

const mapStateToProps = function(_state, ownProps) {
    return {};
};

const mapDispatchToProps = function(dispatch, ownProps) {
    return {
        onSubmit: function(username, password) {
            return new Promise((resolve, reject) => {
                const currentSession = new ActiveDirectory({
                    url: 'ldap://RAMS.adp.vcu.edu',
                    baseDN: 'DC=RAMS,DC=ADP,DC=vcu,DC=edu',
                    username: 'RAMS\\' + username,
                    password: password
                });
                currentSession.findUser(username, (err, auth) => {
                    if (auth) {
                        dispatch(setCredentials(username, password));
                        dispatch(setIdentity(auth));
                        resolve(() => {
                            dispatch(nextStage());
                        });
                    } else {
                        reject(err);
                    }
                });
            });
        }
    };
};

const ActiveDirectoryLoginForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm);

export default ActiveDirectoryLoginForm;