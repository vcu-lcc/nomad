const path = require('path');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
	template: './client/index.html',
	filename: 'index.html',
	inject: 'body'
});
let nodeModules = fs.readdirSync('./node_modules')
	.filter((module) => {
		return module !== '.bin';
	}).reduce((prev, module) => {
		return Object.assign(prev, {[module]: 'commonjs ' + module});
	}, {});

module.exports = {
	cache: true,
	entry: ['babel-polyfill', './client/index.js'],
	output: {
		path: path.resolve('build'),
		filename: 'index_bundle.js',
		sourceMapFilename: 'index_bundle.map'
	},
	devServer: {
		filename: 'index_bundle.js',
		hot: true,
		inline: true
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
	plugins: [
		HtmlWebpackPluginConfig
	],
	target: 'electron',
	externals: nodeModules
};