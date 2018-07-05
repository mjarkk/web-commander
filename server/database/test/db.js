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
  let out = db.genUserInfo('testPass')
  t.truthy(!!out.key)
  t.truthy(!!out.password)
  t.truthy(!!out.salt)
  t.snapshot(out.key.length)
  t.snapshot(out.password.length)
  t.snapshot(out.salt.length)
})