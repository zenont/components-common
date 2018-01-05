import { join } from 'path'
import { cssLoaders, getPlugins, jsLoader } from './loaders'

const dist = '../dist'
const publicPath = '/'

export default (env: any) => {
	const production: boolean = env && env.PRODUCTION && env.PRODUCTION === 'true' || false
	const brand: string = env && env.COBRAND || 'pff'
	const port: number = env && env.HOST_PORT || 9002
	return {
		context: join(__dirname),
		entry: {
			app: [
				...(production === true ? [] : [
					'babel-polyfill',
					'react-hot-loader/patch',
					// activate HMR for React

					`webpack-dev-server/client?http://localhost:${port}`,
					// bundle the client for webpack-dev-server
					// and connect to the provided endpoint

					'webpack/hot/only-dev-server',
					// bundle the client for hot reloading
					// only- means to only hot reload for successful updates)
				]),
				'./index.tsx',
			],
		},
		output: {
			path: join(__dirname, dist),
			filename: '[name].js',
			publicPath
		},
		module: {
			rules: [
				...cssLoaders(production),
				{
					test: /\.(jpe?g|png|gif|svg|jpg|json)$/i,
					exclude: /node_modules/,
					loader: 'file-loader'
				},
				{
					test: /\.(eot|svg|ttf|woff|woff2)$/i,
					exclude: /node_modules/,
					loader: 'file-loader'
				},
				{
					test: /\.(ico)$/i,
					exclude: /node_modules/,
					loader: 'file-loader?name=[name].[ext]'
				},
				...jsLoader(production)
				,
			],
		},
		plugins: getPlugins(production),
		resolve: {
			extensions: ['.jsx', '.js', '.ts', '.tsx'],
			alias: {
				'sass-cobrand': join(__dirname, '../sass', 'cobrand', brand, '_index.scss')
			}
		},
		devtool: 'source-map',
		devServer: {
			port,
			historyApiFallback: true,
			hot: true,
			contentBase: './dist',
		}
	}
}
