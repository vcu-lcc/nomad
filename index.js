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

const DEBUG = process.argv.includes('--dev');

const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const { app, BrowserWindow } = require('electron');
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.js');

let mainWindow;

function loadWebpack() {
  if (DEBUG) {
    webpackConfig.entry.unshift(
      'webpack-dev-server/client?http://localhost:' + (webpackConfig.devServer.port || 8080),
      'webpack/hot/dev-server')
    webpackConfig.plugins.unshift(new Webpack.HotModuleReplacementPlugin());
    let server = new WebpackDevServer(Webpack(webpackConfig));
    server.listen(8080, '127.0.0.1', () => {
      console.log('Starting webpack development server on http://localhost:8080.');
      createWindow();
    });
  } else {
    Webpack(webpackConfig).run((err, stats) => {
      if (err || stats.hasErrors()) {
        console.log('There were some errors while building webpack.');
        if (err) {
          console.error(err);
        }
        console.warn(stats.toJson('minimal'))
      } else {
        console.log('Webpack build successful!');
      }
      createWindow();
    });
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'NOMAD'
  });
  mainWindow.setMenu(null);
  mainWindow.maximize();
  if (DEBUG) {
    mainWindow.loadURL(`http://localhost:8080/index.html`);
    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => console.log(`Sucessfully Added Extension: ${name}.`))
      .catch(err => console.error('An error occurred while installing Electron extension: ', err));
    installExtension(REDUX_DEVTOOLS)
      .then(name => console.log(`Sucessfully Added Extension: ${name}.`))
      .catch(err => console.error('An error occurred while installing Electron extension: ', err));
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(`file://${__dirname}/build/index.html`);
  }
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', loadWebpack);

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});
