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
import ReactDOM from 'react-dom';
import _ from 'lodash';
import {
    ProgressCircle,
    Text
} from 'react-desktop/windows';
// The main wrapper function for encapsulating different 'fragments'
import Carousel from './components/Carousel/Carousel.jsx';
import ActiveDirectoryLoginForm from './components/LoginForm/LoginForm.jsx';
import ComputerNameGenerator from './components/ComputerNameGenerator/ComputerNameGenerator.jsx';

class ConfigStore {
	constructor(callback) {
		this.config = {
			'Template': '',
			'ComputerTypes': [
				'Classroom Podium Workstation',
				'Lab Workstation',
				'Kiosk',
				'Channel Player',
				'Faculty/Staff Computer',
				'Servers'
			],
			'Universities': [],
			'Chainload': []
		};
	}
	set(key, value) {
		this.config[key] = value;
	}
	get(key) {
		return this.config[key];
	}
	apply(newConfig) {
		newConfig = _.merge(this.config, newConfig);
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
}

class NomadArrayAdapter extends Carousel.ArrayAdapter {
	constructor() {
		super();
		this.stage = -1;
		this.configStore = new ConfigStore();
	}
	getNext(previousCallbackProps) {
		switch(++this.stage) {
			case 0:
				this.stage++;
				// return <ActiveDirectoryLoginForm />;
			case 1: {
				this.configStore.set('credentials', previousCallbackProps.credentials);
				this.configStore.loadRemoteConfig(
					'https://files.nuget.ts.vcu.edu/EMS/vcu.json',
					'http://localhost/vcu.json'
				).then(() => this.parent.next());
				return (
					<div
						style={{
							display: 'flex',
							alignItems: 'center'
						}}
					>
						<ProgressCircle
							size={80}
						/>
						<Text
							padding="0px 24px 0px 24px"
							height={60}
							verticalAlignment="center"
						>
							<span
								style={{
									fontSize: 'x-large'
								}}
							>
								Fetching configuration files...
							</span>
						</Text>
					</div>
				);
			}
			case 2: {
				return <ComputerNameGenerator
					universities={this.configStore.get('Universities')}
					template={this.configStore.get('Template')}
					ComputerTypes={this.configStore.get('ComputerTypes')}
				/>;
			}
			default:
				return null;
		}
	}
	onMessage(details) {
	}
}

ReactDOM.render((
	<Carousel
		adapter={new NomadArrayAdapter()}
	>
	</Carousel>
), document.querySelector('#react-root'));

