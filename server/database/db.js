const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const fs = require('fs-extra')
const path = require('path')

const adapter = new FileSync(path.resolve(__dirname, 'db.json'))
const db = low(adapter)

db
  .defaults({ apps: [] })
  .write()

class Database {
  constructor() {
    
  }
  appsList() {

  }
  addApp() {
    
  }
}

module.exports = Database