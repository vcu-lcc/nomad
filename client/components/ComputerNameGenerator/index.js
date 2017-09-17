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
import os from 'os';
import { exec } from 'child_process';
import Sudoer from 'electron-sudo';

const sudo = async function(cmd) {
  let sudoer = new Sudoer({ name: 'Elevate privileges' });
  return await sudoer.exec(cmd);
};

import React from 'react';
import Radium from 'radium';

import {
  Button,
  ProgressCircle
} from 'react-desktop/windows';

import PropTypes from 'prop-types';

import Dropdown from '../Shared/Dropdown';
import FieldSet from '../Shared/FieldSet';
import InputBox from '../Shared/InputBox';

const styles = {
  base: {
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
    cursor: 'default',
    fontFamily: '"Segoe UI"'
  },
  computerNamePreview: {
    flexGrow: '1',
    fontSize: 'larger'
  },
  label: {
    fontSize: 'larger',
    paddingRight: '16px'
  },
  secondaryWrapper: {
    alignItems: 'center',
    display: 'flex',
    minWidth: '600px'
  },
  horizontalMargin: {
    margin: '0 16px'
  }
}

class ComputerNameGenerator extends React.Component {
	constructor(props) {
    super(props);
    let that = this;
    this.options = {
      label: 'Computer Type',
      options: [{
          value: 'Classroom Podium Workstation',
          callback: function() {
            this.setState({
              ComputerName: `[CAMPUS][BUILDING][ROOM]P[#]`
            });
            return {
              label: 'Campus',
              options: this.props.universities.length > 0 ? this.props.universities[0].Campuses.map(campus => {
                return {
                  value: campus.Name,
                  callback: function(campus) {
                    this.setState({
                      ComputerName: `${campus.Acronym || 'null'}[BUILDING][ROOM]P[#]`
                    });
                    return {
                      label: 'Building',
                      options: campus.Buildings.map(building => {
                        return {
                          value: building.Name,
                          callback: function(building) {
                            this.setState({
                              ComputerName: `${campus.Acronym || 'null'}${building.Acronym || 'null'}[ROOM]P[#]`
                            });
                            return {
                              label: 'Room',
                              options: building.Rooms.map(room => {
                                return {
                                  value: room.Name,
                                  // value: (<div
                                  //   style={{
                                  //     display: 'flex'
                                  //   }}
                                  // >
                                  //   <div>{room.Name}</div>
                                  //   <div style={{ flexGrow: '1' }}></div>
                                  //   <div>{room.RoomNumber}</div>
                                  // </div>),
                                  callback: function(room) {
                                    this.setState({
                                      ComputerName: `${campus.Acronym || 'null'}${building.Acronym || 'null'}${room.ID || 'null'}P[#]`
                                    });
                                    return {
                                      label: 'Computer Number',
                                      type: InputBox,
                                      callback: function(computerNumber) {
                                        this.setState({
                                          ComputerName: `${campus.Acronym || 'null'}${building.Acronym || 'null'}${room.ID || 'null'}P${computerNumber[0] || '#'}`,
                                          done: true
                                        });
                                      }.bind(this)
                                    };
                                  }.bind(this, room)
                                };
                              })
                            };
                          }.bind(this, building)
                        };
                      })
                    };
                  }.bind(this, campus)
                }
              }) : []
            };
          }.bind(that)
        }, {
          value: 'Lab Workstation',
          callback: function() {
            this.setState({
              ComputerName: `[CAMPUS][BUILDING][ROOM]L[##]`
            });
            return {
              label: 'Campus',
              options: this.props.universities.length > 0 ? this.props.universities[0].Campuses.map(campus => {
                return {
                  value: campus.Name,
                  callback: function(campus) {
                    this.setState({
                      ComputerName: `${campus.Acronym || 'null'}[BUILDING][ROOM]L[##]`
                    });
                    return {
                      label: 'Building',
                      options: campus.Buildings.map(building => {
                        return {
                          value: building.Name,
                          callback: function(building) {
                            this.setState({
                              ComputerName: `${campus.Acronym || 'null'}${building.Acronym || 'null'}[ROOM]L[##]`
                            });
                            return {
                              label: 'Room',
                              options: building.Rooms.map(room => {
                                return {
                                  value: room.Name,
                                  // value: (<div
                                  //   style={{
                                  //     display: 'flex'
                                  //   }}
                                  // >
                                  //   <div>{room.Name}</div>
                                  //   <div style={{ flexGrow: '1' }}></div>
                                  //   <div>{room.RoomNumber}</div>
                                  // </div>),
                                  callback: function(room) {
                                    this.setState({
                                      ComputerName: `${campus.Acronym || 'null'}${building.Acronym || 'null'}${room.ID || 'null'}L[##]`
                                    });
                                    return {
                                      label: 'Computer Number',
                                      type: InputBox,
                                      callback: function(computerNumber) {
                                        this.setState({
                                          ComputerName: `${campus.Acronym || 'null'}${building.Acronym || 'null'}${room.ID || 'null'}P${computerNumber.substring(0, 2) || '##'}`,
                                          done: true
                                        });
                                      }.bind(this)
                                    };
                                  }.bind(this, room)
                                };
                              })
                            };
                          }.bind(this, building)
                        };
                      })
                    };
                  }.bind(this, campus)
                }
              }) : []
            };
          }.bind(that)
        }, {
          value: 'Kiosk',
          callback: function() {
            return {
              label: 'Campus',
              options: []
            };
          }.bind(that)
        }, {
          value: 'Channel Player',
          callback: function() {
            return {
              label: 'Campus',
              options: []
            };
          }.bind(that)
        }, {
          value: 'Faculty/Staff Computer',
          callback: function() {
            return {
              label: 'Top Level Organizational Unit',
              options: []
            };
          }.bind(that)
        }, {
          value: 'Server',
          callback: function() {
            return {
              label: 'Department',
              options: []
            };
          }.bind(that)
        }]
    };
    this.state = {
      ComputerName: '',
      done: false,
      loading: false,
      fields: []
    }
    setTimeout(this._processFields.bind(this, [this.options]), 0);
  }

  _processFields(path, index=0) {
    let fields = this.state.fields.slice(0, index);
    for (let i = index; i < path.length; i++) {
      fields.push(React.createElement(
        path[i].type || Dropdown,
        {
          ...path[i],
          key: i,
          onChange: ii => {
            if (ii !== null && i !== undefined) {
              if (Array.isArray(path[i].options)) {
                let retVal = path[i].options[ii].callback();
                if (typeof retVal === 'object' && retVal !== null) {
                  this._processFields(path.concat([retVal]), index + 1);
                }
              } else {
                let retVal = path[i].callback(ii);
                if (typeof retVal === 'object' && retVal != null) {
                  this._processFields(path.concat(retVal.next ? [retVal.next] : []), index + 1);
                }
              }
            }
          }
        },
        Array.isArray(path[i].options) ? path[i].options.map(i => i.value) : null
      ));
    }
    this.setState({ fields });
  }

  async changeComputerName(newName) {
    let windowsCommmand = `WMIC computersystem where caption="${os.hostname()}" rename "${newName}"`;
    console.warn('executing command', windowsCommmand);
    try {
      let output = await sudo(windowsCommmand);
      console.log(output);
      if (output.includes('ReturnValue = 0')) {
        return {
          name: os.hostname(),
          message: 'Computer Name successfully modified.',
          detail: output
        };
      } else if (output.includes('ReturnValue = 5')) {
        throw {
          name: os.hostname(),
          message: 'Failed to change Computer Name. This is likely due to the lack of privileges.',
          detail: output
        };
      } else {
        throw {
          name: os.hostname(),
          message: 'Failed to change Computer Name.',
          detail: output
        };
      }
    } catch (err) {
      throw {
        name: os.hostname(),
        message: 'There was an error executing WMIC. Failed to change Computer Name.',
        detail: err.message
      };
    }
  }

	render() {
    return (
      <FieldSet>
        { this.state.fields }
        <div
          style={[styles.base]}
        >
          <div
            style={[styles.label]}
          >
            Computer Name:
          </div>
          <div
            style={[styles.secondaryWrapper]}
          >
            <div
              style={[styles.computerNamePreview]}
            >
              {this.state.ComputerName}
            </div>
            <div
              style={[styles.horizontalMargin]}
            >
            {
              this.state.loading && (<ProgressCircle />)
            }
            </div>
            {
              this.state.done &&
                (<Button push
                  placeholder="Computer ID"
                  onClick={async () => {
                    this.setState({
                      loading: true
                    });
                    try {
                      let result = await this.changeComputerName(this.state.ComputerName);
                      this.props.finish(result.name);
                    } catch(err) {
                      console.error(err);
                    }
                    this.setState({
                      loading: false
                    });
                  }}
                >
                Apply
                </Button>)
            }
          </div>
        </div>
      </FieldSet>
    );
	}
}

ComputerNameGenerator.defaultProps = {
  template: '',
  ComputerTypes: []
};

ComputerNameGenerator.propTypes = {
  template: PropTypes.string,
  ComputerTypes: PropTypes.array
};

export default Radium(ComputerNameGenerator);
