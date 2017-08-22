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
        let that = this;
        this.options = {
            label: 'Computer Type',
            options: [{
                    value: 'Classroom Podium Workstation',
                    callback: function() {
                        return {
                            label: 'Campus',
                            options: this.props.universities.length > 0 ? this.props.universities[0].Campuses.map((campus, i) => {
                                return {
                                    value: campus.Name,
                                    callback: function() {
                                        debugger;
                                        return {
                                            label: 'Building',
                                            options: []
                                        };
                                    }
                                }
                            }) : []
                        };
                    }.bind(that)
                }, {
                    value: 'Lab Workstation',
                    callback: function() {
                        return {
                            label: 'Campus',
                            options: []
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
            loading: false,
            fields: []
        }
        setTimeout(this._processFields.bind(this, [this.options]), 0);
    }

    _processFields(path, index=0) {
        let fields = this.state.fields.slice(0, index);
        for (let i = index; i < path.length; i++) {
            fields.push(<Dropdown
                label={path[i].label}
                key={i}
                onselect={ii => {
                    if (typeof ii == 'number') {
                        this._processFields(path.concat([path[i].options[ii].callback()]), index + 1);
                    }
                }}
            >
                {path[i].options.map(i => i.value)}
            </Dropdown>)
        }
        this.setState({ fields });
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
                            this.state.Computer && this.state.Computer.ID &&
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
    template: '',
    ComputerTypes: []
};

ComputerNameGenerator.propTypes = {
    template: PropTypes.string,
    ComputerTypes: PropTypes.array
};

export default Radium(ComputerNameGenerator);