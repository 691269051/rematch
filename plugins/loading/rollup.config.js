import replace from 'rollup-plugin-replace'
import { uglify } from 'rollup-plugin-uglify'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript'

const pkg = require('./package.json')

const env = process.env.NODE_ENV

const config = {
	input: 'src/index.ts',
	plugins: [
		commonjs(),
		typescript(),
		replace({
			'process.env.NODE_ENV': JSON.stringify(env),
		}),
	],
	output: [
		{
			name: 'RematchLoading',
			file: pkg.unpkg,
			format: 'umd',
			exports: 'named',
			context: 'window',
			moduleContext: { this: 'window' },
			sourcemap: true,
		}, // Universal Modules
		{ file: pkg.main, format: 'cjs', exports: 'named', sourcemap: true }, // CommonJS Modules
		{ file: pkg.module, format: 'es', exports: 'named', sourcemap: true }, // ES Modules
	],
}

const rollupConf = [config]

if (env === 'production') {
	rollupConf.push({
		input: pkg.main,
		plugins: [uglify()],
		output: {
			file: pkg.main,
			format: 'cjs',
			exports: 'named',
			sourcemap: true,
		},
	})
	rollupConf.push({
		input: pkg.browser,
		plugins: [uglify()],
		context: 'window',
		output: {
			name: 'RematchLoading',
			file: pkg.browser,
			format: 'umd',
			exports: 'named',
			sourcemap: true,
		},
	})
}

export default rollupConf
