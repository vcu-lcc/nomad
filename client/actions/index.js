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
export const SET_STAGE = 'SET_STAGE';
export const NEXT_STAGE = 'NEXT_STAGE';
export const SET_CREDENTIALS = 'SET_CREDENTIALS';
export const SET_UNIVERSITY = 'SET_UNIVERSITY';
export const MERGE_CONFIGS = 'MERGE_CONFIGS';
export const SET_URL = 'SET_URL';
export const SET_IDENTITY = 'SET_IDENTITY';
export const SET_TOP_OU = 'SET_TOP_OU';
export const SET_MACHINE_PROPS = 'SET_MACHINE_PROPS';
export const UPDATE_COMPUTER_NAME = 'UPDATE_COMPUTER_NAME';
export const UPDATE_COMPUTER_NAME_SELECTIONS = 'UPDATE_COMPUTER_NAME_SELECTIONS';
export const SET_LOADING = 'SET_LOADING';
export const SET_ACTIVE_DIRECTORY_CONTENTS = 'SET_ACTIVE_DIRECTORY_CONTENTS';
export const REQUEST_ACTIVE_DIRECTORY_PATH = 'REQUEST_ACTIVE_DIRECTORY_PATH';
export const UPDATE_ACTIVE_DIRECTORY_PATH = 'UPDATE_ACTIVE_DIRECTORY_PATH';
export const SET_ACTIVE_DIRECTORY_ERROR = 'SET_ACTIVE_DIRECTORY_ERROR';
export const REJECT_ACTIVE_DIRECTORY_PATH = 'REJECT_ACTIVE_DIRECTORY_PATH';
export const PLACE_COMPUTER_OBJECT = 'PLACE_COMPUTER_OBJECT';
export const FINISHED_PLACING_COMPUTER_OBJECT = 'FINISHED_PLACING_COMPUTER_OBJECT';

export function setStage(stage) {
    return {
        type: SET_STAGE,
        stage
    };
};

export function nextStage() {
    return {
        type: NEXT_STAGE
    };
};

export function setCredentials(username, password) {
    return {
        type: SET_CREDENTIALS,
        credentials: {
            username,
            password
        }
    };
};

export function setUniversity(universities) {
    return {
        type: SET_UNIVERSITY,
        universities
    };
};

export function mergeConfigs(configs) {
    return {
        type: MERGE_CONFIGS,
        configs
    };
};

export function setUrl(url) {
    return {
        type: SET_URL,
        url
    };
};

export function setIdentity(identity) {
    return {
        type: SET_IDENTITY,
        identity
    };
};

export function setTopOu(ou) {
    return {
        type: SET_TOP_OU,
        ou
    };
}

export function setMachineProps(props) {
    return {
        type: SET_MACHINE_PROPS,
        props
    };
};

export function updateComputerName(computerName) {
    return {
        type: UPDATE_COMPUTER_NAME,
        computerName
    };
};

export function updateComputerNameSelections(selections) {
    return {
        type: UPDATE_COMPUTER_NAME_SELECTIONS,
        selections
    };
};

export function setLoading(loading) {
    return {
        type: SET_LOADING,
        loading
    };
};

export function setActiveDirectoryContents(contents) {
    return {
        type: SET_ACTIVE_DIRECTORY_CONTENTS,
        contents
    };
};

export function updateActiveDirectoryPath(path) {
    return {
        type: UPDATE_ACTIVE_DIRECTORY_PATH,
        path
    };
};

export function setActiveDirectoryError(errorText) {
    return {
        type: SET_ACTIVE_DIRECTORY_ERROR,
        errorText
    };
};

export function requestActiveDirectoryPath(requestedPath) {
    return {
        type: REQUEST_ACTIVE_DIRECTORY_PATH,
        requestedPath
    };
};

export function rejectActiveDirectoryPath(reason) {
    return {
        type: REJECT_ACTIVE_DIRECTORY_PATH,
        error: reason
    };
};

export function placeComputerObject() {
    return {
        type: PLACE_COMPUTER_OBJECT
    };
};

export function finishedPlacingComputerObject() {
    return {
        type: FINISHED_PLACING_COMPUTER_OBJECT
    }
}
