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
import { combineReducers } from 'redux';
import {
	SET_STAGE,
	NEXT_STAGE,
	SET_CREDENTIALS,
	SET_UNIVERSITY,
	MERGE_CONFIGS,
	SET_IDENTITY,
	SET_MACHINE_PROPS,
	SET_LOADING,
	SET_ACTIVE_DIRECTORY_PATH,
	SET_ACTIVE_DIRECTORY_CONTENTS
} from '../actions';

const defaultState = {
	stage: 0,
	loading: false,
	credentials: {
		authenticated: false
	},
	activeDirectory: {
		path: 'DC=RAMS,DC=adp,DC=vcu,DC=edu'
	},
	identity: {},
	machine: {},
	Universities: [],
	remote: [
		// 'https://files.nuget.ts.vcu.edu/EMS/vcu.json',
		'http://localhost/vcu.json'
	]
};

const nomadConfig = (state=defaultState, action) => {
	switch (action.type) {
		case SET_STAGE: {
			return {
				...state,
				stage: action.stage
			};
		}
		case NEXT_STAGE: {
			return {
				...state,
				stage: state.stage + 1
			};
		}
		case SET_CREDENTIALS: {
			return {
				...state,
				credentials: {
					...action.credentials,
					authenticated: true
				}
			};
		}
		case SET_UNIVERSITY: {
			return {
				...state,
				universities: action.universities
			};
		}
		case MERGE_CONFIGS: {
			return Object.assign({}, state, ...action.configs);
		}
		case SET_IDENTITY: {
			return {
				...state,
				identity: action.identity
			};
		}
		case SET_MACHINE_PROPS: {
			return {
				...state,
				machine: {
					...state.machine,
					...action.props
				}
			};
		}
		case SET_LOADING: {
			return {
				...state,
				loading: action.loading
			};
		}
		case SET_ACTIVE_DIRECTORY_PATH: {
			return {
				...state,
				activeDirectory: {
					...state.activeDirectory,
					path: action.path
				}
			};
		}
		case SET_ACTIVE_DIRECTORY_CONTENTS: {
			return {
				...state,
				activeDirectory: {
					...state.activeDirectory,
					contents: action.contents
				}
			};
		}
		default:
			return state;
	}
};

export default nomadConfig;