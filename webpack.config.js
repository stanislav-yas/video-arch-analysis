const path = require('path');
const webpack = require('webpack');
// const nodeExternals = require('webpack-node-externals');
const packageJson = require('./package.json');

const { version } = packageJson;
const entryPath = path.join(__dirname, 'src', 'cli');
const outputPath = path.join(__dirname, 'dist', version, 'cli');
const outputFileName = 'index.js';

module.exports = {
  // mode: 'development',
  mode: 'production',
  stats: {
    errorDetails: false,
  },
  entry: path.join(entryPath, 'main.js'),
  target: 'node',
  output: {
    clean: true, // Clean the output directory before emit.
    path: outputPath,
    filename: outputFileName,
  },
  externals: [
    {
      '../app.config': 'commonjs ../app.config',
      msnodesqlv8: 'commonjs msnodesqlv8',
    },
    // nodeExternals()
  ],
  plugins: [
    new webpack.ProgressPlugin(),
    { // my Compiler hook 'done' plugin
      apply: (compiler) => {
        compiler.hooks.done.tap('MyCompilerHookDone', async (stats) => {
          if (stats.hasErrors()) return; // compilation has errors
          const afterBuild = require('./after-build.js');
          await afterBuild(entryPath, outputPath, outputFileName);
        });
      },
    },
  ],

  // module: {
  //   rules: [{
  //     test: /\.(js|jsx)$/,
  //     include: [path.resolve(__dirname, 'src')],
  //     loader: 'babel-loader'
  //   }]
  // }
};
