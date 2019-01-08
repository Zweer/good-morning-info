const path = require('path');
const slsw = require('serverless-webpack');

const rootPath = path.join(__dirname, '..', '..');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,

  output: {
    libraryTarget: 'commonjs',
    path: path.join(rootPath, '.webpack'),
    filename: '[name].js',
  },

  target: 'node',

  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader',
      include: path.join(rootPath, 'lambda'),
    }],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};
