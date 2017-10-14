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
export const SET_IDENTITY = 'SET_IDENTITY';

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

export function setIdentity(identity) {
    return {
        type: SET_IDENTITY,
        identity
    };
};