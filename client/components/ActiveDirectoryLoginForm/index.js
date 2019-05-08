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
import { setCredentials, nextStage, setIdentity, setUrl } from '../../actions';
import { connect } from 'react-redux';
const dns = require('dns');
const ping = require('ping');

const mapStateToProps = function(state, ownProps) {
    return {
        username: state.credentials.username || '',
        password: state.credentials.password || '',
        submit: state.credentials.submit
    };
};

const mapDispatchToProps = function(dispatch, ownProps) {
    return {
        onSubmit: function(username, password) {
            return new Promise((resolve, reject) => {
		try{
			dns.resolve('rams.adp.vcu.edu', async (e,n)=>{
				if(e) alert(e.toString());
				let bestHost = (await Promise.all(await n.map(async h=> `${h}-${(await ping.promise.probe(h)).time}`))).filter(i=>!i.includes('unknown')).find((m,i,arr)=>i === arr.map(m=>+m.split('-')[1]).indexOf(Math.min(...arr.map(m=>m.split('-')[1])))).split('-')[0];
				dns.reverse(bestHost,(e,n)=>{ 
					if(!n[0]) throw new Exception('No name found!');
					dispatch(setUrl(n[0]));
					let ldap = `ldaps://${n[0]}`; 
					let dcified = 'DC=' + 	n[0].split('.').slice(1).join(',DC=').toString().split(',').toString();
					console.log(ldap,dcified);
					doLogin(ldap,dcified,username,password,(res,auth)=>{
						console.log(res);
						if(res) reject(res);
						else {
              						dispatch(setCredentials(username, password));
              						dispatch(setIdentity(auth));
							resolve(()=>{
								dispatch(nextStage());
							});
						}
					});
				});
			});
		} catch (e) {
			console.log(e);
			doLogin('ldaps://RAMS.adp.vcu.edu','DC=RAMS,DC=ADP,DC=vcu,DC=edu',username,password,(res,auth)=>{
				if(res) reject(res);
				else {
              				dispatch(setCredentials(username, password));
              				dispatch(setIdentity(auth));
					resolve(()=>{
						dispatch(nextStage());
					});
				}
			});	
		}
            });
        }
    }; 
};

const doLogin = (ldap,dcString,username,password,cb)=>{
      const currentSession = new ActiveDirectory({
          url: ldap,
          baseDN: dcString,
          username: 'RAMS\\' + username,
          password: password
      });
      currentSession.findUser(username, (err, auth) => {
          if (auth) {
              cb(null,auth);
          } else {
              cb(err);
          }
      });
}

const ActiveDirectoryLoginForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm);

export default ActiveDirectoryLoginForm;
