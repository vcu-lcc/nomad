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
import wmic from 'wmic';
import InfoDialogue from './InfoDialogue';
import { connect } from 'react-redux';
import { setMachineProps } from '../../actions';
import { exec } from 'child_process';
import systemInformation from 'systeminformation';

const mapStateToProps = function(state) {
    return state.machine;
};

const mapDispatchToProps = function(dispatch) {
    systemInformation.system().then(system => {
        dispatch(setMachineProps({
            manufacturer: system.manufacturer,
            modelNumber: system.model,
            serialNumber: system.serial
        }));
    });
    systemInformation.osInfo().then(os => {
        dispatch(setMachineProps({
            architecture: os.arch
        }));
    });
    systemInformation.networkInterfaces().then(nic => {
        dispatch(setMachineProps({
            macAddress: nic[0].mac,
            currentIP: nic[0].ip4
        }));
    });
    return {};
};

const DialogueController = connect(
    mapStateToProps,
    mapDispatchToProps
)(InfoDialogue);

export default DialogueController;