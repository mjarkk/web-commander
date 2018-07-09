"use strict"

// the index.js gets called via this file because the index.js links to deps with es6 import

require('@babel/register')({
  presets: [ '@babel/preset-env' ]
})
require("@babel/polyfill")

module.exports = require('./index.js')