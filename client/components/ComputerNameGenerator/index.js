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
                      ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}[BUILDING][ROOM]P[#]`
                    });
                    return {
                      label: 'Building',
                      options: campus.Buildings.map(building => {
                        return {
                          value: building.Name,
                          callback: function(building) {
                            this.setState({
                              ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}[ROOM]P[#]`
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
                                      ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}${room.RoomNumber.substring(Math.max(0, room.RoomNumber.length - 5), room.RoomNumber.length) || 'null'}P[#]`
                                    });
                                    return {
                                      label: 'Computer Number',
                                      type: InputBox,
                                      callback: function(computerNumber) {
                                        this.setState({
                                          ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}${room.RoomNumber.substring(Math.max(0, room.RoomNumber.length - 5), room.RoomNumber.length) || 'null'}P${computerNumber[0] || '#'}`,
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
                      ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}[BUILDING][ROOM]L[##]`
                    });
                    return {
                      label: 'Building',
                      options: campus.Buildings.map(building => {
                        return {
                          value: building.Name,
                          callback: function(building) {
                            this.setState({
                              ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}[ROOM]L[##]`
                            });
                            return {
                              label: 'Room',
                              options: building.Rooms.map(room => {
                                return {
                                  value: room.Name,
                                  callback: function(room) {
                                    this.setState({
                                      ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}${room.RoomNumber.substring(Math.max(0, room.RoomNumber.length - 5), room.RoomNumber.length) || 'null'}L[##]`
                                    });
                                    return {
                                      label: 'Computer Number',
                                      type: InputBox,
                                      callback: function(computerNumber) {
                                        this.setState({
                                          ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}${room.RoomNumber.substring(Math.max(0, room.RoomNumber.length - 5), room.RoomNumber.length) || 'null'}P${computerNumber.substring(0, 2) || '##'}`,
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
            this.setState({
              ComputerName: `[CAMPUS][BUILDING]...K[##]`
            });
            return {
              label: 'Campus',
              options: this.props.universities.length > 0 ? this.props.universities[0].Campuses.map(campus => {
                return {
                  value: campus.Name,
                  callback: function(campus) {
                    this.setState({
                      ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}[BUILDING]...K[##]`
                    });
                    return {
                      label: 'Building',
                      options: campus.Buildings.map(building => {
                        return {
                          value: building.Name,
                          callback: function(building) {
                            this.setState({
                              ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}...K[##]`
                            });
                            return {
                              label: 'Environment',
                              options: ['Office/Room', 'Other'].map(i => {
                                return {
                                  value: i,
                                  callback: function(env) {
                                    if (env == 'Office/Room') {
                                      this.setState({
                                        ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}[OFFICE/ROOM]K[##]`
                                      });
                                      return {
                                        type: InputBox,
                                        label: 'Office/Room',
                                        callback: function(num) {
                                          this.setState({
                                            ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}${num.substring(0, 5) || '00000'}K[##]`
                                          });
                                          return {
                                            type: InputBox,
                                            label: 'Computer Number',
                                            callback: function(computerNumber) {
                                              this.setState({
                                                ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}${num.substring(0, 5) || '00000'}K${computerNumber.substring(0, 2) || '##'}`,
                                                done: true
                                              });
                                            }.bind(this)
                                          };
                                        }.bind(this)
                                      };
                                    } else {
                                      this.setState({
                                        ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}[FLOOR][LOCATION]K[##]`
                                      });
                                      return {
                                        type: InputBox,
                                        label: 'Floor',
                                        callback: function(floor) {
                                          this.setState({
                                            ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}${floor.substring(0, 2) || '00'}[LOCATION]K[##]`
                                          });
                                          return {
                                            type: InputBox,
                                            label: 'Location',
                                            callback: function(location) {
                                              this.setState({
                                                ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}${floor.substring(0, 2) || '00'}${location.substring(0, 3) || 'null'}K[##]`
                                              });
                                              return {
                                                type: InputBox,
                                                label: 'Computer Number',
                                                callback: function(computerNumber) {
                                                  this.setState({
                                                    ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}${floor.substring(0, 2) || '00'}${location.substring(0, 3) || 'null'}K${computerNumber.substring(0, 2) || '##'}`,
                                                    done: true
                                                  });
                                                }.bind(this)
                                              };
                                            }.bind(this)
                                          };
                                        }.bind(this)
                                      };
                                    }
                                  }.bind(this, i)
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
          value: 'Channel Player',
          callback: function() {
            this.setState({
              ComputerName: `[CAMPUS][BUILDING]...C[##]`
            });
            return {
              label: 'Campus',
              options: this.props.universities.length > 0 ? this.props.universities[0].Campuses.map(campus => {
                return {
                  value: campus.Name,
                  callback: function(campus) {
                    this.setState({
                      ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}[BUILDING]...C[##]`
                    });
                    return {
                      label: 'Building',
                      options: campus.Buildings.map(building => {
                        return {
                          value: building.Name,
                          callback: function(building) {
                            this.setState({
                              ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}...C[##]`
                            });
                            return {
                              label: 'Environment',
                              options: ['Office/Room', 'Other'].map(i => {
                                return {
                                  value: i,
                                  callback: function(env) {
                                    if (env == 'Office/Room') {
                                      this.setState({
                                        ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}[OFFICE/ROOM]C[##]`
                                      });
                                      return {
                                        type: InputBox,
                                        label: 'Office/Room',
                                        callback: function(num) {
                                          this.setState({
                                            ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}${num.substring(0, 5) || '00000'}C[##]`
                                          });
                                          return {
                                            type: InputBox,
                                            label: 'Computer Number',
                                            callback: function(computerNumber) {
                                              this.setState({
                                                ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}${num.substring(0, 5) || '00000'}C${computerNumber.substring(0, 2) || '##'}`,
                                                done: true
                                              });
                                            }.bind(this)
                                          };
                                        }.bind(this)
                                      };
                                    } else {
                                      this.setState({
                                        ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}[FLOOR][LOCATION]C[##]`
                                      });
                                      return {
                                        type: InputBox,
                                        label: 'Floor',
                                        callback: function(floor) {
                                          this.setState({
                                            ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}${floor.substring(0, 2) || '00'}[LOCATION]C[##]`
                                          });
                                          return {
                                            type: InputBox,
                                            label: 'Location',
                                            callback: function(location) {
                                              this.setState({
                                                ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}${floor.substring(0, 2) || '00'}${location.substring(0, 3) || 'null'}C[##]`
                                              });
                                              return {
                                                type: InputBox,
                                                label: 'Computer Number',
                                                callback: function(computerNumber) {
                                                  this.setState({
                                                    ComputerName: `${campus.Acronym.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}${floor.substring(0, 2) || '00'}${location.substring(0, 3) || 'null'}C${computerNumber.substring(0, 2) || '##'}`,
                                                    done: true
                                                  });
                                                }.bind(this)
                                              };
                                            }.bind(this)
                                          };
                                        }.bind(this)
                                      };
                                    }
                                  }.bind(this, i)
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
          value: 'Faculty/Staff Computer',
          callback: function() {
            this.setState({
              ComputerName: `[TOP OU][BUILDING][INITIALS][TYPE][#]`
            });
            return {
              type: InputBox,
              label: 'Top level OU',
              callback: function(topLevelOU) {
                this.setState({
                  ComputerName: `${topLevelOU.substring(0, 3) || 'null'}[BUILDING][INITIALS][TYPE][#]`
                });
                return {
                  label: 'Building',
                  options: this.props.universities.reduce((accum, curr) => accum.concat(curr.Campuses.reduce((accum, curr) => accum.concat(curr.Buildings), [])), [])
                    .map(building => {
                      return {
                        value: building.Name,
                        callback: function(building) {
                          this.setState({
                            ComputerName: `${topLevelOU.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}[INITIALS][TYPE][#]`
                          });
                          return {
                            label: 'Initials',
                            type: InputBox,
                            callback: function(initials) {
                              this.setState({
                                ComputerName: `${topLevelOU.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}${initials.substring(0, 3) || 'null'}[TYPE][#]`
                              });
                              return {
                                label: 'Device Form Factor',
                                options: ["Desktop", "Laptop", "Tablet", "Mobile"].map(formFactor => {
                                  return {
                                    value: formFactor,
                                    callback: function(formFactor) {
                                      this.setState({
                                        ComputerName: `${topLevelOU.substring(0, 3) || 'null'}${building.Acronym.substring(0, 3) || 'null'}${initials.substring(0, 3) || 'null'}${formFactor[0] || 'null'}[#]`
                                      });
                                      return {
                                        label: 'Computer Number',
                                        type: InputBox,
                                        callback: function(computerNumber) {
                                          this.setState({
                                            ComputerName: `${topLevelOU || 'null'}${building.Acronym.substring(0, 3) || 'null'}${initials.substring(0, 3) || 'null'}${formFactor[0] || 'null'}${computerNumber[0] || '#'}`,
                                            done: true
                                          });
                                        }.bind(this)
                                      }
                                    }.bind(this, formFactor)
                                  }
                                })
                              };
                            }.bind(this)
                          }
                        }.bind(this, building)
                      };
                    })
                };
              }.bind(that)
            };
          }.bind(that)
        }, {
          value: 'Server',
          callback: function() {
            this.setState({
              ComputerName: `[DEPARTMENT/FUNCTION][###]`
            });
            return {
              type: InputBox,
              label: 'Department/Function',
              callback: function(departmentFunc) {
                this.setState({
                  ComputerName: `${departmentFunc.substring(0, 12) || 'null'}[###]`
                });
                return {
                  label: 'Computer Number',
                  type: InputBox,
                  callback: function(computerNumber) {
                    this.setState({
                      ComputerName: `${departmentFunc.substring(0, 12) || 'null'}${computerNumber.substring(0, 3) || '###'}`,
                      done: true
                    });
                  }.bind(this)
                }
              }.bind(that)
            };
          }.bind(that)
        }]
    };
    this.state = {
      ComputerName: 'undefined',
      done: false,
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
                  this._processFields(path.concat(retVal ? [retVal] : []), index + 1);
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

	render() {
    return (
      <FieldSet>
        { this.state.fields }
        <ComputerName
          userOverride={true}
          userSubmit={this.state.done}
          minLength={1}
          maxLength={15}
          resolve={name => {
            this.props.finish(name);
          }}
        >
          {this.state.ComputerName}
        </ComputerName>
      </FieldSet>
    );
	}
}

ComputerNameGenerator.defaultProps = {
  ComputerTypes: []
};

ComputerNameGenerator.propTypes = {
  ComputerTypes: PropTypes.array
};

export default Radium(ComputerNameGenerator);
