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
import PackageInstaller from './PackageInstaller';
import { nextStage, setPackages } from '../../actions';
import { connect } from 'react-redux';
import { getPackages } from './API';

const mapStateToProps = function(state) {
    return {
        sources: state.packageSelector.sources,
        packages: Object.entries(state.packageSelector.packages).reduce((accum, keyValue) => accum.concat(keyValue[1].map(_package => ({
            ..._package,
            source: console.log(_package) || keyValue[0]
        }))), [])
    };
};

const mapDispatchToProps = function(dispatch) {
    return {
        resolve: dispatch.bind(this, nextStage()),
        refreshPackages: async sources => {
            for (let source of sources.filter(source => source.enabled)) {
                let knownPackageIds = {};
                dispatch(setPackages(source.origin, (await getPackages(source.origin)).map(_package => ({
                    feedName: _package.Feed_Name,
                    feedId: _package.Feed_Id,
                    packageId: _package.Package_Id,
                    enabled: false
                })).filter(_package => _package.packageId in knownPackageIds ? false : (knownPackageIds[_package.packageId] = true))));
            }
        }
    };
};

const PackageController = connect(
    mapStateToProps,
    mapDispatchToProps
)(PackageInstaller);

export default PackageController;