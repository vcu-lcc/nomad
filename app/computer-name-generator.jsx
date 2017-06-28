import React from 'react';
import {
    Button,
    Label,
    ProgressCircle,
    Text,
    TextInput,
    View
} from 'react-desktop/windows';
import Dropdown from './dropdown';

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