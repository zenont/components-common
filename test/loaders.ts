import { EnvironmentPlugin, HotModuleReplacementPlugin, NamedModulesPlugin, NoEmitOnErrorsPlugin, optimize } from 'webpack' // tslint:disable-line:max-line-length
import * as UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import * as OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as ExtractTextPlugin from 'extract-text-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

export const cssLoaders = (production: boolean) => {
	const prdLoader: any = [{
		test: /\.(sass|scss|css)$/,
		use: ExtractTextPlugin.extract({
			fallback: 'style-loader',
			use: ['css-loader', 'resolve-url-loader', 'sass-loader?sourceMap']
		})
	}]

	const devLoader = [{
		test: /\.(sass|scss|css)$/,
		use: [
			{
				loader: 'style-loader',
				options: {
					sourceMap: true
				}
			},
			{
				loader: 'css-loader',
				options: {
					sourceMap: true,
				},
			},
			{ loader: 'resolve-url-loader' },
			{
				loader: 'sass-loader',
				options: {
					sourceMap: true
				}
			}
		]
	}]

	return production === true ? prdLoader : devLoader
}

export const jsLoader = (production: boolean) => {
	const plugins = production === true ? [] : ['react-hot-loader/babel']

	return [{
		test: /\.ts(x?)$/,
		exclude: [/node_modules/],
		use: [{
			loader: 'babel-loader',
			options: {
				presets: [['env', { modules: false, useBuiltIns: 'usage', targets: { browsers: ['last 2 major versions', 'ie 10'] } }], 'react'],
				plugins,
				babelrc: false
			}
		},
		{
			loader: 'ts-loader',
			options: {
				configFile: 'tsconfig-test.json'
			}
		}
		],
	}]
}

export const getPlugins = (production: boolean) => {
	const devPlugins = [
		new HotModuleReplacementPlugin(),
		new NamedModulesPlugin(),
		new NoEmitOnErrorsPlugin()
	]
	const prdPlugins = [
		new optimize.CommonsChunkPlugin({
			name: 'common',
			filename: 'common.js',
			minChunks: 2,
		}),
		new UglifyJSPlugin(),
		new ExtractTextPlugin({
			filename: '[name].css',
			allChunks: true
		}),
		new OptimizeCssAssetsPlugin(),
		new BundleAnalyzerPlugin({
			// Can be `server`, `static` or `disabled`.
			// In `server` mode analyzer will start HTTP server to show bundle report.
			// In `static` mode single HTML file with bundle report will be generated.
			// In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
			analyzerMode: 'server',
			// Host that will be used in `server` mode to start HTTP server.
			analyzerHost: '127.0.0.1',
			// Port that will be used in `server` mode to start HTTP server.
			analyzerPort: 8885,
			// Path to bundle report file that will be generated in `static` mode.
			// Relative to bundles output directory.
			reportFilename: 'report.html',
			// Module sizes to show in report by default.
			// Should be one of `stat`, `parsed` or `gzip`.
			// See "Definitions" section for more information.
			defaultSizes: 'parsed',
			// Automatically open report in default browser
			openAnalyzer: true,
			// If `true`, Webpack Stats JSON file will be generated in bundles output directory
			generateStatsFile: false,
			// Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
			// Relative to bundles output directory.
			statsFilename: 'stats.json',
			// Options for `stats.toJson()` method.
			// For example you can exclude sources of your modules from stats file with `source: false` option.
			// See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
			statsOptions: null,
			// Log level. Can be 'info', 'warn', 'error' or 'silent'.
			logLevel: 'info'
		})
	]

	return [
		new HtmlWebpackPlugin({
			template: 'index.html',
			filename: 'index.html',
			inject: 'body',
		}),
		...(production === true ? prdPlugins : devPlugins),
		new EnvironmentPlugin({
			NODE_ENV: production === true ? 'production' : 'development', // use 'development' unless process.env.NODE_ENV is defined,
			DEBUG: !production
		})
	]
}
