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
    ProgressCircle
} from 'react-desktop/windows';
import PropTypes from 'prop-types';
import Dropdown from '../Shared/Dropdown/dropdown.jsx';
import FieldSet from '../Shared/FieldSet/FieldSet.jsx';
import InputBox from '../Shared/InputBox/InputBox.jsx';
import Radium from 'radium';

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
        this.state = {
            University: null,
            Campus: null,
            Building: null,
            Room: null,
            ComputerNumber: null,
            ComputerName: '',
            loading: false
        }
	}

    calculateComputerName() {
        this.setState({
            ComputerName: 'null'
        });
    }

	render() {
        return (
            <FieldSet>
                <Dropdown
                    label="University"
                    onselect={function(i) {
                        this.setState({
                            University: this.props.universities[i],
                            Campus: null,
                            Building: null,
                            Room: null,
                            ComputerNumber: null
                        });
                        this.calculateComputerName();
                    }.bind(this)}
                >
                    {this.props.universities.map(i => i.Name)}
                </Dropdown>
                {
                    this.state.University &&
                        (<Dropdown
                            label="Campus"
                            onselect={function(i) {
                                this.setState({
                                    Campus: this.state.University.Campuses[i],
                                    Building: null,
                                    Room: null,
                                    ComputerNumber: null
                                });
                                this.calculateComputerName();
                            }.bind(this)}
                        >
                            {this.state.University.Campuses.map(i => i.Name)}
                        </Dropdown>)
                }
                {
                    this.state.Campus &&
                        (<Dropdown
                            label="Building"
                            onselect={function(i) {
                                this.setState({
                                    Building: this.state.Campus.Buildings[i],
                                    Room: null,
                                    ComputerNumber: null
                                });
                                this.calculateComputerName();
                            }.bind(this)}
                        >
                            {this.state.Campus.Buildings.map(i => i.Name)}
                        </Dropdown>)
                }
                {
                    this.state.Building &&
                        (<Dropdown
                            label="Room"
                            onselect={function(i) {
                                this.setState({
                                    Room: this.state.Building.Rooms[i],
                                    ComputerNumber: null
                                });
                                this.calculateComputerName();
                            }.bind(this)}
                        >
                            {this.state.Building.Rooms.map(i => i.Name)}
                        </Dropdown>)
                }
                {
                    this.state.Room &&
                        (<InputBox
                            placeholder="Computer ID"
                            onChange={function(s) {
                                this.setState({
                                    ComputerNumber: s
                                });
                                this.calculateComputerName();
                            }.bind(this)}
                        >
                        </InputBox>)
                }
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
                            this.state.ComputerNumber &&
                                (<Button push
                                    placeholder="Computer ID"
                                    onClick={function() {
                                        this.calculateComputerName();
                                        this.setState({
                                            loading: true
                                        });
                                        setTimeout(() => {
                                            this.setState({
                                                loading: false
                                            });
                                        }, 1000);
                                    }.bind(this)}
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
    template: ''
};

ComputerNameGenerator.propTypes = {
    template: PropTypes.string
};

export default Radium(ComputerNameGenerator);