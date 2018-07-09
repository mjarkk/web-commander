"use strict"

// the run.js gets called via this file because the run.js links to deps with es6 import

require('@babel/register')({
  presets: [ '@babel/preset-env' ]
})
require("@babel/polyfill")

module.exports = require('./run.js')