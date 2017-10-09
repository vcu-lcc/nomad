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
import _ from 'lodash';

class ConfigStore {
	constructor(config={}) {
		this.config = config;
	}
	set(key, value) {
		this.config[key] = value;
		this.onChange(this.config);
	}
	get(key) {
		return this.config[key];
	}
	apply(newConfig) {
		newConfig = _.merge(this.config, newConfig);
		this.onChange(this.config);
	}
	async loadRemoteConfig(/*...urls*/) {
		for (let url of arguments) {
			try {
				this.apply(await this._fetchConfig(url));
			} catch (err) {
				console.error('Error while obtaining JSON config from ' + url, err);
			}
		}
		let chainload = this.config.Chainload;
		if (chainload.length > 0) {
			this.config.Chainload = [];
			await loadRemoteConfig(...chainload);
		}
	}
	async _fetchConfig(url) {
		return new Promise((resolve, reject) => {
			var request = require('request');
			request({
				url,
				json: true
			}, (error, response, body) => {
				if (error || response.statusCode != 200) {
					reject(new Error(error || 'Unexpected status code: ' + response.statusCode));
				} else {
					resolve(body);
				}
			});
		});
	}
	onChange(config) {
	}
}

ConfigStore.globalConfig = new ConfigStore();

export default ConfigStore;