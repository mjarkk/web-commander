#!/usr/bin/env node

// The CLI tool for the app

const program = require('commander')
const inquirer = require('inquirer')
const colors = require('colors')
const path = require('path')
const fs = require('fs-extra')

const get = require('./fetch.js')

const log = console.log

program
  .version(fs.readJsonSync(path.resolve(__dirname, './../package.json')).version)
  .command('info')
  .alias('i')
  .description('Info about the server') 
  .action((query, argv) => {
    // get.json('/status')
    // .then(data => log(data))
    // .catch(err => log(err))
  })

program.parse(process.argv)