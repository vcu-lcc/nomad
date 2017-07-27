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
			"Universities": [],
			"Chainload": []
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
	loadRemoteConfig(urls) {
		return new Promise((resolve, reject) => {
			Promise.all(
				Array.from(arguments).map(
					i => new Promise(this._fetchConfig.bind(this, i))
				)
			).then(function(configs) {
				configs.forEach(i => this.apply(i));
				if (this.config.Chainload.length > 0) {
					let chainload = this.config.Chainload;
					this.config.Chainload = [];
					loadRemoteConfig(...chainload).then(() => resolve());
				} else {
					resolve();
				}
			}.bind(this));
		});
	}
	_fetchConfig(url, resolve, reject) {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.onload = function() {
			resolve(JSON.parse(xhr.responseText));
		}.bind(this);
		xhr.onerror = function(e) {
			reject(e);
		}.bind(this);
		xhr.send();
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
					'https://files.nuget.ts.vcu.edu/EMS/vcu.json'
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

