import test from 'ava'
import info from '../info'

test('Shared info file is object', t => {
  t.is(typeof info, 'object')
})

test('Shared info file contains valid keys', t => {
  t.is(typeof info.appName, 'string')
})