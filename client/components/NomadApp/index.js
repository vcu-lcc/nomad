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
import _ from 'lodash';

// The ArrayAdapter that defines the main pathway this application will take.
import NomadArrayAdapter from './/NomadArrayAdapter';
// The main wrapper class for encapsulating different 'fragments'
import Carousel from '../Shared/Carousel';
// Config objects
import ConfigStore from '../Shared/ConfigStore';

class NomadApp extends React.Component {
    constructor(props) {
        super(props);
        props.config.onChange = config => this._update(config);
    }
    _update(config) {
    }
    render() {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Carousel
                    adapter={new NomadArrayAdapter(this.props.config)}
                >
                </Carousel>
            </div>
        );
    }
}
NomadApp.defaultProps = {
    config: ConfigStore.globalConfig
};
NomadApp.propTypes = {
    config: PropTypes.object
};

export default NomadApp;