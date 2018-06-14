const path = require('path')
const webpack = require('webpack')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const LiveReloadPlugin = require('webpack-livereload-plugin')

let production = true

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
      },{
        test: /\.vue$/,
        use: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new LiveReloadPlugin({})
  ],
  devtool: (production) ? 'none' : 'source-map',
  mode: (production) ? 'production' : 'development',
  watch: !production
}