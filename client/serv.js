const express = require('express')
const fs = require('fs-extra')
const path = require('path')

const log = console.log

class Client {
  constructor(app, conf) {
    this.app = app
    this.conf = conf
    this.setup(app)
  }
  setup(app) {
    app.use(express.static(path.resolve(__dirname, 'public')))
    app.use(express.static(path.resolve(__dirname, 'build')))
  }
}

module.exports = Client