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

program
  .command('status')
  .alias('S')
  .description('Get the current status of the server') 
  .action((query, argv) => {
    get.json('/status')
    .then(data => {
      if (data.status) { 
        log(colors.green.bold('Server is up and running')) 
      } else {
        log(colors.red.bold('The server is not working'))
      }
    })
    .catch(err => log(err))
  })

program
  .command('add')
  .alias('a')
  .description('Add a service')
  .action((q,a) => {
    get.json('/status')
    .then(d => {
      
    })
  })

program.parse(process.argv)