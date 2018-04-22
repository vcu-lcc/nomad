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
// Import react-desktop elements
import {
  Button,
  ProgressCircle
} from 'react-desktop/windows';

const styles = {
  base: {
    cursor: 'default',
    fontFamily: '"Segoe UI"',
    height: '80vh',
    userSelect: 'none',
    width: '80vw'
  },
  breadcrumb: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row-reverse',
    fontWeight: '100',
    padding: '8px 0 0 0',
    overflow: 'auto',
    maxWidth: 'max-content'
  },
  path: {
    color: '#1d1d1d',
    cursor: 'pointer',
    padding: '8px',
    whiteSpace: 'nowrap'
  },
  pathDivider: {
    borderBottom: '3px solid transparent',
    borderLeft: '4px solid #1d1d1d',
    borderTop: '3px solid transparent',
    color: '#1d1d1d',
    height: '0',
    margin: '0 8px',
    transform: 'translateY(1.5px)',
    width: '0'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    fontWeight: '300',
    padding: '12px 0',
    width: '100%'
  },
  headerLabel: {
    width: '50%'
  },
  content: {
    borderTop: 'solid 1px rgba(0,0,0,.2)',
    height: '60vh',
    margin: '0 0 32px 0',
    overflow: 'auto',
    width: '100%'
  },
  contentItem: {
    borderBottom: 'solid 1px rgba(0,0,0,.1)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    padding: '10px 2px',
    maxWidth: '100%'
  },
  contentItemLabel: {
    width: '50%'
  },
  bottomBar: {
    alignItems: 'center',
    display: 'flex',
    width: '100%'
  }
};

class ActiveDirectorySelector extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.updatePath(this.props.path[0].actualPath);
    if (this.props.apply) {
      this.placeComputerObject(this.props.apply);
    }
  }
  
  placeComputerObject(options) {
    this.props.placeComputerObject(options);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevProps.apply && this.props.apply) {
      this.placeComputerObject(this.props.apply);
    }
  }

  render() {
    return (
      <div style={[styles.base]}>
        <style>{`
          div.minimalScrollbar::-webkit-scrollbar {
            width: 8px;
            background-color: rgba(0,0,0,.1);
          }
          div.minimalScrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(0,0,0,.3);
          }
        `}</style>
        <div style={[styles.breadcrumb]} className="minimalScrollbar">
          { this.props.loading && <ProgressCircle size={25} /> }
          { this.props.loading && this.props.path.length > 0 && <div style={[styles.pathDivider]}></div> }
          {
            this.props.path.reverse().map((p, idx, arr) => <div key={idx} style={[styles.path]} onClick={() => this.props.updatePath(p.actualPath)}>{p.name}</div>)
              .reduce((accum, curr, idx, arr) => accum.concat([
                curr,
                idx < arr.length - 1 ? <div key={idx + arr.length} style={[styles.pathDivider]}></div> : null,
              ]), [])
          }
        </div>
        <div style={[styles.header]}>
          <div style={[styles.headerLabel]}>Name</div>
          <div style={[styles.headerLabel]}>Type</div>
        </div>
        <div className="minimalScrollbar" style={[styles.content]}>
          {
            this.props.contents.map((e, i, arr) => (
              <div key={i} style={[styles.contentItem]} onClick={() => this.props.updatePath(e.path)}>
                <div style={[styles.contentItemLabel]}>{e.name}</div>
                <div style={[styles.contentItemLabel]}>{e.type}</div>
              </div>
            ))
          }
        </div>
        <div style={[styles.bottomBar]}>
          <div style={{flexGrow: '1'}}></div>
          <div style={{
            padding: '0 16px'
          }}>
            { this.props.apply && <ProgressCircle /> }
          </div>
          <Button onClick={ () => this.props.applyActiveDirectory() }>Submit</Button>
        </div>
      </div>
    );
  }
};

ActiveDirectorySelector.defaultProps = {
  apply: null,
  contents: [],
  loading: true,
  path: []
};

ActiveDirectorySelector.propTypes = {
  apply: PropTypes.shape({
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    computerName: PropTypes.string.isRequired
  }),
  contents: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired
  })),
  loading: PropTypes.bool,
  path: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    actualPath: PropTypes.string.isRequired
  })),
  applyActiveDirectory: PropTypes.func.isRequired,
  placeComputerObject: PropTypes.func.isRequired,
  updatePath: PropTypes.func.isRequired,
};

export default Radium(ActiveDirectorySelector);