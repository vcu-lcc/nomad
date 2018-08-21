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
import PropTypes from 'prop-types';

import ComputerName from './ComputerName';

import Dropdown from '../Shared/Dropdown';
import FieldSet from '../Shared/FieldSet';
import InputBox from '../Shared/InputBox';

class ComputerNameGenerator extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      done: false,
      fields: []
    };
  }

  updateFields(selections) {
    let fields = [{
      label: 'Computer Type',
      options: ['Classroom Podium Workstation', 'Lab Workstation', 'Kiosk', 'Channel Player', 'Faculty/Staff Computer', 'Server']
    }];
    let computerName = '';
    switch (selections[0]) {
      case 0:
      case 1: {
        let university = selections.length > 1 ? this.props.universities[selections[1]] : null;
        let campus = university && selections.length > 2 ? university.Campuses[selections[2]] : null;
        let building = campus && selections.length > 3 ? campus.Buildings[selections[3]] : null;
        let room = building && selections.length > 4 ? building.Rooms[selections[4]] : null;
        let computerNumber = room && selections.length > 5 ? selections[5] : null;
        fields.push({
          label: 'University',
          options: this.props.universities.map(u => u.Name)
        });
        if (university) {
          fields.push({
            label: 'Campus',
            options: university.Campuses.map(c => c.Name)
          });
        }
        if (campus) {
          fields.push({
            label: 'Building',
            options: campus.Buildings.map(b => b.Name)
          });
        }
        if (building) {
          fields.push({
            label: 'Room',
            options: building.Rooms.map(r => r.Name)
          });
        }
        if (room) {
          fields.push({
            label: 'Computer Number'
          });
        }
        this.setState({
          done: !!computerNumber
        });
        computerName = (campus ? campus.Acronym.substring(0, 3) || 'null' : '[CAMPUS]')
          + (building ? building.Acronym.substring(0, 3) || 'null' : '[BUILDING]')
          + (room ? room.RoomNumber.substring(Math.max(0, room.RoomNumber.length - 5), room.RoomNumber.length) || 'null' : '[ROOM]')
          + (selections[0] == 0 ? 'P' : 'L')
          + (computerNumber ? computerNumber.substring(0, 3)|| '#' : '[#]');
        break;
      }
      case 2:
      case 3: {
        const ENVIRONMENTS = ['Office/Room', 'Other'];
        let university = selections.length > 1 ? this.props.universities[selections[1]] : null;
        let campus = university && selections.length > 2 ? university.Campuses[selections[2]] : null;
        let building = campus && selections.length > 3 ? campus.Buildings[selections[3]] : null;
        let environment = building && selections.length > 4 ? ENVIRONMENTS[selections[4]] : null;
        let center = '...';
        let roomNumber = environment == ENVIRONMENTS[0] && selections.length > 5 ? selections[5] : null;
        let floor = environment == ENVIRONMENTS[1] && selections.length > 5 ? selections[5] : null;
        let location = floor && selections.length > 6 ? selections[6] : null;
        let computerNumber = null;
        if (roomNumber) {
          computerNumber = selections.length > 6 ? selections[6] : null;
        }
        if (location) {
          computerNumber = selections.length > 7 ? selections[7] : null;
        }
        fields.push({
          label: 'University',
          options: this.props.universities.map(u => u.Name)
        });
        if (university) {
          fields.push({
            label: 'Campus',
            options: university.Campuses.map(c => c.Name)
          });
        }
        if (campus) {
          fields.push({
            label: 'Building',
            options: campus.Buildings.map(b => b.Name)
          });
        }
        if (building) {
          fields.push({
            label: 'Environment',
            options: ENVIRONMENTS
          });
        }
        if (environment === ENVIRONMENTS[0]) {
          fields.push({
            label: 'Office/Room'
          });
          center = roomNumber ? roomNumber.substring(0, 5) || '00000' : '[OFFICE/ROOM]';
        } else if (environment === ENVIRONMENTS[1]) {
          fields.push({
            label: 'Floor'
          });
          if (floor) {
            fields.push({
              label: 'Location'
            });
          }
          center = (floor ? floor.substring(0, 2) || '00' : '[FLOOR]')
            + (location ? location.substring(0, 3) || 'null' : '[LOCATION]');
        }
        if (roomNumber || location) {
          fields.push({
            label: 'Computer Number'
          });
        }
        this.setState({
          done: !!computerNumber
        });
        computerName = (campus ? campus.Acronym.substring(0, 3) || 'null' : '[CAMPUS]')
          + (building ? building.Acronym.substring(0, 3) || 'null' : '[BUILDING]')
          + center
          + (selections[0] == 2 ? 'K' : 'C')
          + (computerNumber ? computerNumber.substring(0, 3)|| '##' : '[##]');
        break;
      }
      case 4: {
        const FORM_FACTORS = ['Desktop', 'Laptop', 'Tablet', 'Mobile'];
        let university = selections.length > 1 ? this.props.universities[selections[1]] : null;
        let campus = university && selections.length > 2 ? university.Campuses[selections[2]] : null;
        let topOU = campus && selections.length > 3 ? selections[3] : null;
        let building = topOU && selections.length > 4 ? campus.Buildings[selections[4]] : null;
        let initials = building && selections.length > 5 ? selections[5] : null;
        let formFactor = initials && selections.length > 6 ? FORM_FACTORS[selections[6]] : null;
        let computerNumber = formFactor && selections.length > 7 ? selections[7] : null;
        fields.push({
          label: 'University',
          options: this.props.universities.map(u => u.Name)
        });
        if (university) {
          fields.push({
            label: 'Campus',
            options: university.Campuses.map(c => c.Name)
          });
        }
        if (campus) {
          fields.push({
            label: 'Top Level OU'
          });
        }
        if (topOU) {
          fields.push({
            label: 'Building',
            options: campus.Buildings.map(b => b.Name)
          });
        }
        if (building) {
          fields.push({
            label: 'Initials'
          });
        }
        if (initials) {
          fields.push({
            label: 'Device Form Factor',
            options: FORM_FACTORS
          });
        }
        if (formFactor) {
          fields.push({
            label: 'Computer Number'
          });
        }
        this.setState({
          done: !!computerNumber
        });
        computerName = (topOU ? topOU.substring(0, 3) || 'null' : '[TOP OU]')
          + (building ? building.Acronym.substring(0, 3) || 'null' : '[BUILDING]')
          + (initials ? initials.substring(0, 3) || 'null' : '[INITIALS]')
          + (formFactor ? formFactor[0] || '#' : '[#]')
          + (computerNumber ? computerNumber.substring(0, 3)|| '#' : '[#]');
        break;
      }
      case 5: {
        let deptFunc = selections.length > 1 ? selections[1] : null;
        let computerNumber = deptFunc && selections.length > 2 ? selections[2] : null;
        fields.push({
          label: 'Department/Function'
        });
        if (deptFunc) {
          fields.push({
            label: 'Computer Number'
          });
        }
        this.setState({
          done: !!computerNumber
        });
        computerName = (deptFunc ? deptFunc.substring(0, 12) || 'null' : '[DEPTARTMENT/FUNCTION]')
          + (computerNumber ? computerNumber.substring(0, 3) || '###' : '[###]');
        break;
      }
    }
    this.setState({
      fields
    });
    if (computerName) {
      this.props.setComputerName(computerName);
    }
  }

  componentDidMount() {
    this.updateFields(this.props.selections);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selections.length !== this.props.selections.length
      || !this.props.selections.reduce((accum, e, i) => accum ? e === nextProps.selections[i] : false, true)) {
      // update asynchronously if the previous and next selections differ
      setTimeout(() => this.updateFields(nextProps.selections));
    }
  }

	render() {
    return (
      <FieldSet>
        {
          this.state.fields.map((e, i) => e.options ?
            (<Dropdown key={this.props.selections.slice(0, i).join(',')} label={e.label} index={i < this.props.selections.length ? this.props.selections[i] : -1}
              options={e.options} onSelect={idx => idx === this.props.selections[i] || this.props.updateSelections(this.props.selections.slice(0, i).concat([idx]))} />)
          : (<InputBox key={this.props.selections.slice(0, i).join(',')} label={e.label} defaultValue={i < this.props.selections.length ? this.props.selections[i] : -1}
            onChange={s => s === this.props.selections[i] || this.props.updateSelections(this.props.selections.slice(0, i).concat([s]))} />))
        }
        <ComputerName
          allowUserOverride={this.props.allowUserOverride}
          userSubmit={this.state.done}
          minLength={this.props.minLength}
          maxLength={this.props.maxLength}
	  setComputerName={this.props.setComputerName}
          resolve={name => {
            this.props.resolve(name);
          }}
          submitOnMount={this.props.apply}
        >
          {this.props.computerName}
        </ComputerName>
      </FieldSet>
    );
	}
}

ComputerNameGenerator.defaultProps = {
  allowUserOverride: false,
  computerName: '',
  selections: [],
  universities: [],
  minLength: 0,
  maxLength: Infinity,
  apply: false
};

ComputerNameGenerator.propTypes = {
  allowUserOverride: PropTypes.bool,
  computerName: PropTypes.string,
  selections: PropTypes.array,
  universities: PropTypes.array,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  apply: PropTypes.bool
};

export default Radium(ComputerNameGenerator);
