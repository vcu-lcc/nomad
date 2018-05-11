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

const styles = {
  base: {
    height: '90vh',
    width: '95vw',
    fontFamily: 'sans-serif',
    padding: '16px'
  },
  header: {
    paddingBottom: '32px'
  },
  label: {
    fontSize: 'xx-large',
    cursor: 'default',
    userSelect: 'none'
  }
};

class PackageInstaller extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    require('./API').getAllPackages("nuget.ts.vcu.edu");
    // this.props.refreshPackages(this.props.sources);
  }

  render() {
    return (
      <div style={styles.base}>
        <div style={styles.header}>
          <span style={styles.label}>Packages</span>
        </div>
        <div>
          { false && this.props.packages.map((_package, i) => <div key={i}>{_package.packageId}</div>) }
        </div>
      </div>
    );
  }
}

PackageInstaller.defaultProps = {
  refreshPackages: () => {},
  sources: [],
  packages: []
};

PackageInstaller.propTypes = {
  refreshPackages: PropTypes.func.isRequired,
  sources: PropTypes.arrayOf(PropTypes.shape({
    enabled: PropTypes.bool.isRequired,
    origin: PropTypes.string.isRequired
  })).isRequired,
  packages: PropTypes.arrayOf(PropTypes.shape({
    source: PropTypes.string.isRequired,
    feedId: PropTypes.number.isRequired,
    feedName: PropTypes.string.isRequired,
    packageId: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired
  })).isRequired
};

export default Radium(PackageInstaller);
