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
    userSelect: 'none',
    cursor: 'default',
    fontFamily: '"Segoe UI"',
    position: 'absolute',
    transition: 'transform 1000ms ease-out',
    transform: 'translateY(-100%)'
  }
};

class InfoBanner extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        style={[styles.base, {
          transform: this.props.visible ? 'translateY(0)' : 'translateY(-100%)',
          backgroundColor: this.props.background
        }]}
      >
        {this.props.children}
      </div>
    );
  }
}

InfoBanner.defaultProps = {
  background: '#2d89ef',
  visible: false
};

InfoBanner.propTypes = {
  background: PropTypes.string,
  visible: PropTypes.bool
};

export default Radium(InfoBanner);