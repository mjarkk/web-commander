import test from 'ava'
import exp from '../../shared/helpers/express'
import Serv from '../serv'

// log(`\n\n${JSON.stringify(data)}\n\n`)

const log = console.log
const app = exp.app()
const serv = new Serv(app, { port: 4444 }) // a random port

test('fake express server setup', t => {
  t.is(typeof serv, 'object')
})

test.cb('req default route', t => {
  exp.newReq('/api/', (data, err) => {
    if (err) {
      t.fail(err)
    } else if (data.status) {
      t.fail(`expredted status === false ${JSON.stringify(data)}`)
    } else {
      t.snapshot(data)
    }
    t.end()
  })
})

test.cb('req status', t => {
  exp.newReq('/api/status/', (data, err) => {
    if (err) {
      t.fail(err)
    } else if (!data.status) {
      t.fail('response status needs to be true')
    } else {
      t.pass()
    }
    t.end()
  })
})