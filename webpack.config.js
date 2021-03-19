const path = require('path');
const webpack = require('webpack');
// const nodeExternals = require('webpack-node-externals');
const packageJson = require('./package.json');
const __version__ = packageJson.version;
const __entryPath__ = path.join(__dirname, 'src');
const __outputPath__ = path.join(__dirname, 'build', __version__);
const __outputFilename__ = 'index.js';

module.exports = {
  // mode: 'development',
  mode: 'production',
  stats: {
    errorDetails: false
  },
  entry: path.join(__entryPath__, 'main.js'),
  target: 'node',
  output: {
    clean: false, // Clean the output directory before emit.
    path: __outputPath__,
    filename: __outputFilename__
  },
  externals: [
    { 
      './config': 'commonjs ./config',
      'msnodesqlv8': 'commonjs msnodesqlv8'
    },
    // nodeExternals()
  ],
  plugins: [
    new webpack.ProgressPlugin(),
    { // my Compiler hook 'done' plugin
      apply: (compiler) => {
        compiler.hooks.done.tap('MyAfterBuildPlugin => ', async (compilation) => {
          const afterBuild = require('./after-build.js');
          await afterBuild(__entryPath__, __outputPath__,  __outputFilename__);
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