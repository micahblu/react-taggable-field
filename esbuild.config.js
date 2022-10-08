const esbuild = require('esbuild')
const InlineCSSPlugin = require('esbuild-plugin-inline-css')

esbuild.build({
  entryPoints: ['src/react-taggable-field/react-taggable-field.jsx'],
  bundle: true,
  outfile: 'dist/index.js',
	format: 'esm',
	plugins: [
		InlineCSSPlugin()
	]
}).catch(() => process.exit(1))