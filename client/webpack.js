const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const LiveReloadPlugin = require('webpack-livereload-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

let cleanOptions = {
  root: path.resolve(__dirname, './build/'),
  exclude: [],
  verbose: true,
  dry: false
}

module.exports = production => ({
  entry: {
    bundel: './client/src/js/index.js'
  },
  output: {
    filename: 'js/[hash].[name].js',
    path: path.resolve(__dirname, './build/')
  },
  resolve: {
    alias: production ? {
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    } : {}
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
    new CleanWebpackPlugin(['js'], cleanOptions),
    new FriendlyErrorsWebpackPlugin(),
    new LiveReloadPlugin({}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': production ? '"production"' : '"development"'
    }),
    new HtmlWebpackPlugin({
      production,
      hash: true,
      filename: 'index.html',
      template: './client/src/index.html'
    }),
  ],
  optimization: {
    minimize: production
  },
  devtool: (production) ? 'none' : 'source-map',
  mode: (production) ? 'production' : 'development',
  watch: !production
})