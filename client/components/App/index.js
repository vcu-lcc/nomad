/*
  Copyright (C) 2017 Darren Chan

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/
import React from 'react';
// Banner for information
import InfoBanner from '../InfoBanner';
// The main wrapper class for encapsulating different 'fragments'
import Carousel from '../Shared/Carousel';
// The different 'fragments' that we have
import ActiveDirectoryLoginForm from '../ActiveDirectoryLoginForm';
import ConfigFetcher from '../ConfigFetcher';
import ComputerNameGenerator from '../ComputerNameGenerator';
import ActiveDirectorySelector from '../ActiveDirectorySelector';
import PackageInstaller from '../PackageInstaller';
// Dialog for more information
import InfoDialogue from '../InfoDialogue';

const App = () => (
  <div>
    <InfoBanner />
    <Carousel>
      <ActiveDirectoryLoginForm />
      <ConfigFetcher />
      <ComputerNameGenerator />
      <ActiveDirectorySelector />
      <PackageInstaller />
    </Carousel>
    <InfoDialogue />
  </div>
);

export default App;