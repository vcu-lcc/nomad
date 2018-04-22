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
    cursor: 'default',
    boxShadow: '0 5px 12px 0px rgba(0,0,0,0)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '"Segoe UI"',
    transition: 'transform 1000ms ease-out, box-shadow 1000ms ease-out',
    transform: 'translateY(-100%)',
    userSelect: 'none',
    width: '100vw',
    zIndex: 1
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    padding: '8px 16px 12px 16px'
  }
};

class InfoBanner extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.topOU != nextProps.topOU) {
      this.props.updateOU(nextProps.topOU);
    }
  }

  render() {
    return (
      <div
        style={[styles.base, {
          transform: this.props.visible ? 'translateY(0)' : 'translateY(-100%)',
          boxShadow: this.props.visible ? '0 5px 12px 0px rgba(0,0,0,0.15)' : '0 5px 12px 0px rgba(0,0,0,0)',
          backgroundColor: this.props.background
        }]}
      >
        <div
          style={[styles.row]}
        >
          <div>{this.props.name}</div>
          <div style={{ flexGrow: '1' }}></div>
          <div>Organizational Unit: {this.props.topOU}</div>
        </div>
      </div>
    );
  }
}

InfoBanner.defaultProps = {
  background: '#ffc40d',
  name: 'Unknown User',
  topOU: 'Unknown',
  visible: false
};

InfoBanner.propTypes = {
  background: PropTypes.string,
  name: PropTypes.string,
  topOU: PropTypes.string,
  visible: PropTypes.bool
};

export default Radium(InfoBanner);