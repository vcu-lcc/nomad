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

const path = require('path');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
	template: './client/index.html',
	filename: 'index.html',
	inject: 'body'
});
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

let nodeModules = fs.readdirSync('./node_modules')
	.filter(module => module !== '.bin')
	.reduce((prev, module) => {
		return Object.assign(prev, {[module]: 'commonjs ' + module});
	}, {});

module.exports = {
	cache: true,
	entry: ['babel-polyfill', './client/index.js'],
	externals: nodeModules,
	devServer: {
		contextBase: path.join(__dirname, 'client'),
		filename: 'index_bundle.js',
		historyApiFallback: true,
		hot: true,
		inline: true,
		overlay: true,
		port: 8080
	},
	devtool: 'cheap-module-eval-source-map',
	module: {
		loaders: [{
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/
		}, {
			test: /\.jsx$/,
			loader: 'babel-loader',
			exclude: /node_modules/
		}, {
			test: /\.css$/,
			loader: 'css',
			exclude: /node_modules/
		}, {
			test: /\.(jpg|png|svg)$/,
			loader: 'url-loader',
			options: {
				limit: 1000
				// Use urls if images are bigger than 1 KB.
			},
			exclude: /node_modules/
		}]
	},
	output: {
		path: path.resolve('build'),
		filename: 'index_bundle.js',
		sourceMapFilename: 'index_bundle.map'
	},
	plugins: [
		HtmlWebpackPluginConfig,
		new UglifyJsPlugin()
	],
	resolve: {
		extensions: ['.js', '.jsx', '.json', '.css']
	},
	stats: {
		colors: true
	},
	target: 'electron'
};