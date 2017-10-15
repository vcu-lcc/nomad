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
import Sudoer from 'sudo-prompt';

import React from 'react';
import Radium from 'radium';
import PropTypes from 'prop-types';

import {
  Button,
  ProgressCircle
} from 'react-desktop/windows';

const sudo = function(cmd) {
  return new Promise((resolve, reject) => {
    Sudoer.exec(cmd, { name: 'Elevate privileges' }, function(error, stdout, stderr) {
      error ? reject(error) : resolve(stdout || stderr);
    });
  });
};

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
    fontSize: 'larger',
    WebkitUserModify: 'read-write-plaintext-only'
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
  },
  error: {
    backgroundColor: '#FFCCCC',
    color: '#FF0033'
  }
};

class ComputerName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      forceEnable: false,
      error: false
    };
    this.computerNameElem = null;
  }

  async changeComputerName(newName) {
    let windowsCommmand = `WMIC computersystem where caption="${os.hostname()}" rename "${newName}"`;
    try {
      let output = await sudo(windowsCommmand);
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

  validate() {
    if (this.props.error ||
      this.computerNameElem.innerText.length < this.props.minLength ||
      this.computerNameElem.innerText.length > this.props.maxLength ||
      this.computerNameElem.innerText.match(new RegExp('\\\\|\\/|\\*|:|\\?|"|<|>|\\|'))) {
      this.setState({
        error: true
      });
    } else {
      this.setState({
        error: false
      });
    }
  }

  componentDidMount() {
    this.validate();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.children != nextProps.children ||
      this.props.minLength != nextProps.minLength ||
      this.props.maxLength != nextProps.maxLength) {
      this.validate();
    }
  }

  render() {
    return (
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
          <span
            style={[styles.computerNamePreview, this.state.error ? styles.error : {}]}
            ref={input => this.computerNameElem = input}
            onClick={() => {
              if (this.props.userOverride) {
                this.computerNameElem.setAttribute('contenteditable', '');
                this.setState({
                  forceEnable: true
                });
              }
            }}
            onBlur={() => {
              this.computerNameElem.removeAttribute('contenteditable');
            }}
            onKeyDown={e => {
              if (e.key == 'Enter') {
                e.preventDefault();
              }
            }}
            onInput={e => {
              if (this.computerNameElem.innerText.includes('\n')) {
                this.computerNameElem.innerText = this.computerNameElem.innerText.replace(/\n/g, '');
              }
              this.validate();
            }}
          >
            {this.props.children}
          </span>
          <div
            style={[styles.horizontalMargin]}
          >
          {
            this.state.loading && (<ProgressCircle />)
          }
          </div>
          <Button push
            placeholder="Computer ID"
            hidden={!this.state.forceEnable && !this.props.userSubmit}
            onClick={async () => {
              this.setState({
                loading: true
              });
              try {
                let result = await this.changeComputerName(this.computerNameElem.innerText);
                this.props.resolve(result.name);
              } catch(err) {
                this.props.reject(err);
              }
              this.setState({
                loading: false
              });
            }}
          > Apply </Button>
        </div>
      </div>
    );
  }
}

ComputerName.defaultProps = {
  userOverride: false,
  userSubmit: false,
  children: 'undefined',
  minLength: 0,
  maxLength: Infinity,
  error: false,
  resolve: function() {
    console.log(...arguments);
  },
  reject: function() {
    console.error(...arguments);
  }
};

ComputerName.propTypes = {
  userOverride: PropTypes.bool,
  userSubmit: PropTypes.bool,
  children: PropTypes.string,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  error: PropTypes.bool,
  resolve: PropTypes.func,
  reject: PropTypes.func
};

export default Radium(ComputerName);