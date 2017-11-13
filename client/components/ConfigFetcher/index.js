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
import React from 'react';
import LoadingScreen from '../Shared/LoadingScreen';
import { mergeConfigs, nextStage } from '../../actions';
import { connect } from 'react-redux';
import request from 'request';
import fs from 'fs';

const fetchConfig = function(url) {
	return new Promise((resolve, reject) => {
		request({
			url,
			json: true
		}, (error, response, body) => {
			if (error || response.statusCode != 200) {
				reject(error || 'Unexpected status code: ' + response.statusCode);
			} else {
				resolve(body);
			}
		});
	});
};
const getLocalConfig = function(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            try {
                err ? reject(err) : resolve(JSON.parse(data));
            } catch (err) {
                reject(err);
            }
        });
    });
};
const reflectAll = function(promises) {
    return new Promise((resolve, reject) => {
        Promise.all(promises.map(p => new Promise(
            (resolve, reject) => {
                p.then(result => resolve({
                    status: 'resolved',
                    result
                }))
                .catch(result => resolve({
                    status: 'rejected',
                    result
                }));
            }
        )))
        .then(results => {
            resolve({
                resolved: results.filter(p => p.status == 'resolved').map(p => p.result),
                rejected: results.filter(p => p.status == 'rejected').map(p => p.result)
            });
        });
    });
};

class ConfigFetcher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: ['Loading...']
        };
    }
    applyConfig(urls, localPaths) {
        this.setState({
            messages: ['Fetching Configuration Files...']
        });
        return new Promise((resolve, reject) => {
            reflectAll([...urls.map(url => fetchConfig(url)), ...localPaths.map(path => getLocalConfig(path))])
                .then(results => {
                    let delay = false;
                    if (results.rejected.length > 0) {
                        let errors = results.rejected.map(e => e.toString().trim());
                        delay = true;
                        this.setState({
                            messages: ['Some errors occured while fetching config files:', ...errors, 'Continuing in 5 seconds...']
                        });
                    }
                    setTimeout(() => resolve(results.resolved), delay ? 5000 : 0);
                });
        });
    }
    componentWillMount() {
        this.applyConfig(this.props.remote, this.props.local)
            .then(configs => this.props.resolve(configs))
            .catch(error => this.props.reject(error));
	}
	render() {
		return (
            <LoadingScreen>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>{ this.state.messages.map((s, i) => <span key={i} style={{padding: '12px'}}>{s}</span>) }</div>
            </LoadingScreen>
        );
	}
}

const mapStateToProps = function(state) {
    return {
        remote: state.remote,
        local: state.local
    };
};

const mapDispatchToProps = function(dispatch) {
    return {
        reject: error => {
            // @TODO: Report bug
        },
    	resolve: configs => {
    		dispatch(mergeConfigs(configs));
    		dispatch(nextStage());
    	}
    };
};

const ConfigController = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConfigFetcher);

export default ConfigController;
