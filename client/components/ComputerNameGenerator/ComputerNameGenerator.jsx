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
import {
    Button,
    Label,
    ProgressCircle,
    Text,
    TextInput,
    View
} from 'react-desktop/windows';
import Dropdown from '../Shared/Dropdown/dropdown.jsx';

module.exports = class ComputerNameGenerator extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Dropdown
					label="Campus"
					options={["MCV", "MPC"]}
				></Dropdown>
			</div>
		);
	}
}