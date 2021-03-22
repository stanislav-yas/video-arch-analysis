const path = require('path');
const webpack = require('webpack');
// const nodeExternals = require('webpack-node-externals');
const packageJson = require('./package.json');
const _version_ = packageJson.version;
const _entryPath_ = path.join(__dirname, 'src', 'cli');
const _outputPath_ = path.join(__dirname, 'dist', _version_, 'cli');
const _outputFileName_ = 'index.js';

module.exports = {
  // mode: 'development',
  mode: 'production',
  stats: {
    errorDetails: false
  },
  entry: path.join(_entryPath_, 'main.js'),
  target: 'node',
  output: {
    clean: false, // Clean the output directory before emit.
    path: _outputPath_,
    filename: _outputFileName_
  },
  externals: [
    { 
      '../app.config': 'commonjs ../app.config',
      'msnodesqlv8': 'commonjs msnodesqlv8'
    },
    // nodeExternals()
  ],
  plugins: [
    new webpack.ProgressPlugin(),
    { // my Compiler hook 'done' plugin
      apply: (compiler) => {
        compiler.hooks.done.tap('MyCompilerHookDone', async (stats) => {
          if(stats.hasErrors()) return; // compilation has errors
          const afterBuild = require('./after-build.js');
          await afterBuild(_entryPath_, _outputPath_,  _outputFileName_);
        });
      }
    }
  ],

  // module: {
  //   rules: [{
  //     test: /\.(js|jsx)$/,
  //     include: [path.resolve(__dirname, 'src')],
  //     loader: 'babel-loader'
  //   }]
  // }
}