const argv = require('minimist')(process.argv)

const log = (...toLog) => (argv.noLogs || argv.noLog || argv.nolog || argv.nologs)
  ? true
  : console.log(...toLog)

module.exports = log