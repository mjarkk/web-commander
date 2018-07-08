const webpack = require('webpack')
const path = require('path')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const LiveReloadPlugin = require('webpack-livereload-plugin')

let production = false

module.exports = {
  entry: {
    bundel: './client/src/js/index.js'
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, './build/')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          presets: ['es2015']
        }
      },
      {
        test: /\.styl$/, 
        loader: 'style-loader!css-loader!stylus-loader' 
      }
    ]
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new LiveReloadPlugin({})
  ],
  devtool: (production) ? 'none' : 'source-map',
  mode: (production) ? 'production' : 'development',
  watch: !production
}