require('dotenv').config()
const express = require('express')
const argv = require('minimist')(process.argv)

const imports = {
  client: require('./server/serv.js'),
  server: require('./client/serv.js')
}
const conf = {
  port: Number(process.env.Web_Server_Port)
}
const log = console.log
const app = express()

if (argv.dev) {
  const webpack = require('webpack')
  const webpackMiddleware = require('webpack-dev-middleware')
  const compiler = webpack(require('./client/webpack.config.dev.js'))
  app.use(webpackMiddleware(compiler, {
    writeToDisk: true
  }))
}

app.use(express.static('client/public'))
app.use(express.static('client/build'))

const client = new imports.client(app, conf)
const server = new imports.server(app, conf)

app.listen(conf.port, () => console.log(`WebServer running on port: ${conf.port}`))