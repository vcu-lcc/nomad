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
    ProgressCircle,
    Text
} from 'react-desktop/windows';

class LoadingScreen extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
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
						{this.props.children}
					</span>
				</Text>
			</div>
		);
	}
}

export default LoadingScreen;