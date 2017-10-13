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

// The main wrapper class for encapsulating different 'fragments'
import React from 'react';
import Carousel from '../Shared/Carousel';

// The different 'fragments' that we have
import ActiveDirectoryLoginForm from '../LoginForm';
import ComputerNameGenerator from '../ComputerNameGenerator';
import PackageInstaller from '../PackageInstaller';
import LoadingScreen from '../Shared/LoadingScreen';
// Config objects
import ConfigStore from '../Shared/ConfigStore';

class NomadArrayAdapter extends Carousel.ArrayAdapter {
  constructor(config=ConfigStore.globalConfig) {
    super();
    this.stage = -1;
    this.configStore = config;
  }

  getNext(previousCallbackProps) {
  switch(++this.stage) {
    case 0:
      return <ActiveDirectoryLoginForm />;
    case 1: {
      this.configStore.set('credentials', previousCallbackProps.credentials);
      console.log(previousCallbackProps);
      this.configStore.loadRemoteConfig(
        // 'https://files.nuget.ts.vcu.edu/EMS/vcu.json',
        'http://localhost/vcu.json'
      ).then(() => this.parent.next());
      return <LoadingScreen> Fetching configuration files... </LoadingScreen>
    }
    case 2: {
      return <ComputerNameGenerator
        universities={this.configStore.get('Universities')}
        template={this.configStore.get('Template')}
        ComputerTypes={this.configStore.get('ComputerTypes')}
      />;
    }
    case 3: {
      return <PackageInstaller />;
    }
    default:
      return null;
    }
  }
  onMessage(details) {
  }
}

export default NomadArrayAdapter;
