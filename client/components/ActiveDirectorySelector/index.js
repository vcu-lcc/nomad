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
import ActiveDirectorySelector from './ActiveDirectorySelector';
import { setLoading, nextStage, setActiveDirectoryPath, setActiveDirectoryContents } from '../../actions';
import { connect } from 'react-redux';

let globalSession = null;

const mapStateToProps = function(state, ownProps) {
  if (!globalSession) {
    globalSession = new ActiveDirectory({
      url: 'ldap://RAMS.adp.vcu.edu',
      username: 'RAMS\\' + state.credentials.username,
      password: state.credentials.password
    });
  }
  let splitPath = state.activeDirectory.path.split(',').map(s => [s.split('=')[0].toUpperCase(), s.split('=').slice(1).join('=')]);
  let displayPath = [];
  let dc = false;
  for (let i = 0; i != splitPath.length; i++) {
    if (splitPath[i][0] == 'DC') {
      if (dc) {
        displayPath[displayPath.length - 1] += '.';
      } else {
        displayPath.push('');
        dc = true;
      }
      displayPath[displayPath.length - 1] += splitPath[i][1];
    } else {
      displayPath.push(splitPath[i][1]);
    }
  }
  let path = displayPath.map((e, i) => {
    return {
      name: e,
      actualPath: splitPath.slice(i).map(i => i.join('=')).join(',')
    };
  }).reverse();
  return {
    contents: state.activeDirectory.contents,
    loading: state.loading,
    path
  };
};

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    updatePath: (path) => {
      if (typeof path != 'string') {
        throw new Error('Invalid path type ' + typeof path);
      }
      dispatch(setLoading(true));
      globalSession.find({
        baseDN: path,
        filter: '(objectClass=*)',
        scope: 'one'
      }, (err, results) => {
        if (results) {
          dispatch(setActiveDirectoryPath(path));
          let sanitized = [];
          Object.keys(results).forEach(category => results[category].forEach(obj => {
            sanitized.push({
              type: category,
              name: obj.dn.split(',')[0].split('=').slice(1).join('='),
              path: obj.dn
            });
          }));
          dispatch(setActiveDirectoryContents(sanitized));
        } else {
          // @TODO: dispatch a warning
        }
        dispatch(setLoading(false));
      });
    }
  };
};

const ActiveDirectoryLoginForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveDirectorySelector);

export default ActiveDirectoryLoginForm;