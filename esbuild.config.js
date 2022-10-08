const esbuild = require('esbuild')
const InlineCSSPlugin = require('esbuild-plugin-inline-css')
const { nodeExternalsPlugin } = require('esbuild-node-externals')

esbuild.build({
  entryPoints: ['src/react-taggable-field/react-taggable-field.jsx'],
  bundle: true,
  outfile: 'dist/index.js',
	format: 'esm',
	target: 'chrome79',
	plugins: [
		InlineCSSPlugin(),
		nodeExternalsPlugin()
	]
}).catch(() => process.exit(1))