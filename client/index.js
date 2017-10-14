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
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import nomadConfig from './reducers';

import App from './components/App';

let store;

if (typeof window.__REDUX_DEVTOOLS_EXTENSION__ == 'undefined') {
    store = createStore(
        nomadConfig
    );
} else {
    store = createStore(
        nomadConfig,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
}


ReactDOM.render((
	<Provider store={store}>
		<App />
	</Provider>
), document.getElementById('react-root'));
