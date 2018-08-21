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
import Radium from 'radium';
import {
    Button
} from 'react-desktop/windows';
import { restartPC } from '../../../APIs';

const styles = {
  base: {
    fontFamily: 'sans-serif',
    display: 'flex',
    flexDirection: 'column'
  },
  huge: {
    fontSize: 'x-large',
    textAlign: 'center'
  },
  error: {
    color: 'red'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    padding: '16px'
  }
}

class ConfirmationPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (<div style={[styles.base]}>
        <span style={[styles.huge]}>
	    { this.props.errorText ?'Something Went Wrong!':'Computer Renaming and Active Directory Join Complete!' }
	</span>
	<code style={[styles.error]}>{ this.props.errorText? this.props.errorText :''}</code>
        <div style={[styles.buttonGroup]}>
          <div style={styles.button}><Button onClick={close}>Quit NOMAD</Button></div>
          <div style={styles.button}><Button onClick={restartPC}>Restart PC</Button></div>
        </div>
    </div>);
  }
}
export default Radium(ConfirmationPage);
