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
import InfoBanner from './InfoBanner';
import { nextStage } from '../../actions';
import { connect } from 'react-redux';

const mapStateToProps = function(state) {
    return {
        visible: state.credentials.authenticated,
        name: state.identity.displayName,
        topOU: typeof state.identity.dn == 'string' ? state.identity.dn.split(',')
            .filter(i => i.startsWith('OU='))
            .map(i => i.split('=')[1])
            .pop() : null
    };
};

const mapDispatchToProps = function(dispatch) {
    return {};
};

const InfoController = connect(
    mapStateToProps,
    mapDispatchToProps
)(InfoBanner);

export default InfoController;