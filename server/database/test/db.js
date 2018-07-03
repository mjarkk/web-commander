import test from 'ava'
import db from '../db'

test('Instace of database is object', t => {
  t.is(typeof db, 'object')
})

test('Users returns array', t => {
  t.regex(JSON.stringify(db.users()), /^\[.{0,}\]$/)
})

test('genUserInfo works', t => {
  t.plan(6)
  let outData = db.genUserInfo('testPass')
  t.truthy(!!outData.key)
  t.truthy(!!outData.password)
  t.truthy(!!outData.salt)
  t.snapshot(outData.key.length)
  t.snapshot(outData.password.length)
  t.snapshot(outData.salt.length)
})