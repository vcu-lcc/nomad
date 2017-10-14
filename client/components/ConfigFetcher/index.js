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
}

class ConfigFetcher extends React.Component {
	componentWillMount() {
		Promise.all(this.props.urls.map(url => fetchConfig(url)))
			.then(configs => this.props.resolve(configs))
	}
	render() {
		return <LoadingScreen> Fetching configuration files... </LoadingScreen>;
	}
}

const mapStateToProps = function(state) {
    return {
        urls: state.remote
    };
};

const mapDispatchToProps = function(dispatch) {
    return {
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
