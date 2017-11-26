const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
let precss = require('precss')
let autoprefixer = require('autoprefixer')
let postcssImport = require('postcss-import')
let postcssCalc = require('postcss-calc')

module.exports = {
  entry: {
    'missing-notes': [
      'babel-polyfill',
      './src/index.js'
    ],
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        include: path.resolve('src'),
        test: /\.jsx?$/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
        },
      },
      {
        include: path.resolve('src'),
        test: /\.css$/,
        loaders: [
          'style',
          'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss',
        ],
      }
    ],
  },
  postcss: webpack => [
    postcssImport({
      path: ['node_modules', './src'],
      addDependencyTo: webpack
    }),
    autoprefixer({'browsers':['last 2 versions', 'Android 4.0', 'ie >= 9']}),
    precss,
    postcssCalc,
  ],
  plugins: [
    new CleanWebpackPlugin('dist'),
  ],
}
