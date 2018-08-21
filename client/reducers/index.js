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
import _ from 'lodash';
import { combineReducers } from 'redux';
import {
	SET_STAGE,
	NEXT_STAGE,
	SET_CREDENTIALS,
	SET_UNIVERSITY,
	MERGE_CONFIGS,
	SET_IDENTITY,
	SET_TOP_OU,
	SET_MACHINE_PROPS,
	UPDATE_COMPUTER_NAME,
	UPDATE_COMPUTER_NAME_SELECTIONS,
	SET_LOADING,
	SET_ACTIVE_DIRECTORY_CONTENTS,
	UPDATE_ACTIVE_DIRECTORY_PATH,
	SET_ACTIVE_DIRECTORY_ERROR,
	REQUEST_ACTIVE_DIRECTORY_PATH,
	REJECT_ACTIVE_DIRECTORY_PATH,
	PLACE_COMPUTER_OBJECT,
	FINISHED_PLACING_COMPUTER_OBJECT
} from '../actions';

const defaultState = {
	stage: 0,
	loading: false,
	credentials: {
		authenticated: false,
		username: '',
		password: '',
		submit: false
	},
	computerNameGenerator: {
		allowUserOverride: true,
		computerName: null,
		minLength: 1,
		maxLength: 15,
		selections: []
	},
	activeDirectory: {
		apply: false,
		path: 'DC=RAMS,DC=adp,DC=vcu,DC=edu',
		requestedPath: false,
		loading: false
	},
	identity: {},
	machine: {},
	Universities: [],
	remote: [
		'https://files.nuget.ts.vcu.edu/EMS/vcu.json'
	],
	local: [
		// 'config.json'
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
			return _.merge({}, state, ...action.configs);
		}
		case SET_IDENTITY: {
			return {
				...state,
				identity: action.identity
			};
		}
		case SET_TOP_OU: {
			if (state.activeDirectory.path.includes('OU=')) {
				// If the OU is already defined, it is probably being overriden by some local or remote config.
				return {...state};
			} else {
				return {
					...state,
					activeDirectory: {
						...state.activeDirectory,
						path: `OU=${ action.ou },DC=${ state.activeDirectory.path.split('DC=').slice(1).join('DC=') }`
					}
				};
			}
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
		case UPDATE_COMPUTER_NAME: {
			return {
				...state,
				computerNameGenerator: {
					...state.computerNameGenerator,
					computerName: action.computerName
				}
			}
		}
		case UPDATE_COMPUTER_NAME_SELECTIONS: {
			return {
				...state,
				computerNameGenerator: {
					...state.computerNameGenerator,
					selections: action.selections
				}
			}
		}
		case SET_LOADING: {
			return {
				...state,
				loading: action.loading
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
		case UPDATE_ACTIVE_DIRECTORY_PATH: {
			return {
				...state,
				activeDirectory: {
					...state.activeDirectory,
					path: action.path,
					requestedPath: false
				}
			};
		}
		case SET_ACTIVE_DIRECTORY_ERROR: {
			return {
				...state,
				activeDirectory: {
					...state.activeDirectory,
					errorText: action.errorText
				}
			};
		}
		case REQUEST_ACTIVE_DIRECTORY_PATH: {
			return {
				...state,
				activeDirectory: {
					...state.activeDirectory,
					requestedPath: action.requestedPath
				}
			};
		}
		case REJECT_ACTIVE_DIRECTORY_PATH: {
			return {
				...state,
				activeDirectory: {
					...state.activeDirectory,
					requestedPath: false
				}
			}
		}
		case PLACE_COMPUTER_OBJECT: {
			return {
				...state,
				activeDirectory: {
					...state.activeDirectory,
					apply: true
				}
			}
		}
		case FINISHED_PLACING_COMPUTER_OBJECT: {
			return {
				...state,
				activeDirectory: {
					...state.activeDirectory,
					apply: false
				}
			}
		}
		default:
			return state;
	}
};

export default nomadConfig;
