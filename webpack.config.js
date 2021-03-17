const path = require('path');
const webpack = require('webpack');
// const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  stats: {
    errorDetails: true
  },
  entry: './src/main.js',
  target: 'node',
  externals: [
    { 
      './config': 'commonjs ./config',
      'msnodesqlv8': 'commonjs msnodesqlv8'
    },
    // nodeExternals()
  ],
  plugins: [new webpack.ProgressPlugin()],

  // module: {
  //   rules: [{
  //     test: /\.(js|jsx)$/,
  //     include: [path.resolve(__dirname, 'src')],
  //     loader: 'babel-loader'
  //   }]
  // }
}