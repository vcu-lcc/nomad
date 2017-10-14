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
import PropTypes from 'prop-types';
import Radium from 'radium';

const styles = {
  base: {
    bottom: '24px',
    cursor: 'default',
    fontFamily: '"Segoe UI"',
    position: 'absolute',
    right: '24px',
    userSelect: 'none',
    zIndex: '1'
  },
  infoIcon: {
    background: '#2d89ef',
    borderRadius: '100%',
    color: '#eff4ff',
    fontStyle: 'italic',
    fontWeight: 'bolder',
    height: '24px',
    margin: '2px 8px 8px 8px',
    textAlign: 'center',
    width: '24px'
  },
  dialogue: {
    background: '#eff4ff',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    margin: '8px 0 0 8px',
    opacity: '0',
    padding: '12px',
    transition: 'opacity 100ms ease-out'
  },
  originArrow: {
    borderLeft: '20px solid transparent',
    borderRight: '20px solid transparent',
    borderTop: '20px solid #eff4ff',
    height: '0',
    transition: 'opacity 100ms ease-out',
    width: '0'
  },
  infoRow: {
    display: 'flex',
    flexDirection: 'row',
    padding: '4px'
  }
};

class InfoDialogue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }
  render() {
    return (
      <div
        style={[styles.base]}
        onMouseLeave={() => this.setState({ visible: false })}
      >
        <div
          style={[styles.dialogue, {
            opacity: this.state.visible ? '1' : '0'
          }]}
        >
          <div style={[styles.infoRow]}>
            <span>Manufacturer: </span>
            <span style={{ flexGrow: '1', minWidth: '16px' }}></span>
            <span>{ this.props.manufacturer }</span>
          </div>
          <div style={[styles.infoRow]}>
            <span>Model Number: </span>
            <span style={{ flexGrow: '1', minWidth: '16px' }}></span>
            <span>{ this.props.modelNumber }</span>
          </div>
          <div style={[styles.infoRow]}>
            <span>Serial Number: </span>
            <span style={{ flexGrow: '1', minWidth: '16px' }}></span>
            <span>{ this.props.serialNumber }</span>
          </div>
          <div style={[styles.infoRow]}>
            <span>Architecture: </span>
            <span style={{ flexGrow: '1', minWidth: '16px' }}></span>
            <span>{ this.props.architecture }</span>
          </div>
          <div style={[styles.infoRow]}>
            <span>MAC Address: </span>
            <span style={{ flexGrow: '1', minWidth: '16px' }}></span>
            <span>{ this.props.macAddress }</span>
          </div>
          <div style={[styles.infoRow]}>
            <span>IP Address: </span>
            <span style={{ flexGrow: '1', minWidth: '16px' }}></span>
            <span>{ this.props.currentIP }</span>
          </div>
        </div>
        <div
          style={{
            float: 'right',
            display: 'flex',
            flexDirection: 'column',
            marginTop: '-6px'
          }}
        >
          <div style={[styles.originArrow, {
            opacity: this.state.visible ? '1' : '0'
          }]}></div>
          <div
            onMouseEnter={() => this.setState({ visible: true })}
            style={[styles.infoIcon]}
          >i</div>
        </div>
      </div>
    );
  }
}

InfoDialogue.defaultProps = {
  manufacturer: 'unavaliable',
  modelNumber: 'unavaliable',
  serialNumber: 'unavaliable',
  architecture: 'unavaliable',
  macAddress: 'unavaliable',
  currentIP: 'unavaliable'
};

InfoDialogue.propTypes = {
  manufacturer: PropTypes.string,
  modelNumber: PropTypes.string,
  serialNumber: PropTypes.string,
  architecture: PropTypes.string,
  macAddress: PropTypes.string,
  currentIP: PropTypes.string
};

export default Radium(InfoDialogue);