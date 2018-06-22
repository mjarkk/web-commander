// Add a app to the server

const inquirer = require('inquirer')
const ora = require('ora')

const get = require('./fetch.js')

const log = console.log

class AddProcess {
  constructor(q,a) {
    this.spinner = ora('Loading...').start()
    get.json('/status')
    .then(d => d.status
      ? this.ask('The new app name? (max 20chars)\n>', output => output.length < 20)
      : Error()
    )
    .then(ouput => {
      this.log(ouput.serviceName)
      setTimeout(() => {
        this.exit()
      }, 2000)
    })
    .catch(err => log(err))
  }
  log(...inputs) {
    if (!this.spinner.isSpinning) {
      this.startLoader()
    }
    this.spinner.info(...inputs)
    this.startLoader()
  }
  stopLoader() {
    this.spinner.stop()
  }
  startLoader() {
    this.spinner.start()
  }
  exit() {
    log('\n')
    process.exit()
  }
  ask(message, validate) {
    this.stopLoader()
    let input = inquirer.prompt({
      type: 'input',
      name: 'serviceName',
      message,
      validate
    })
    return input
  }
} 

module.exports = () => new AddProcess