import test from 'ava'
import encrpytion from '../encryption'
import networkHandeler from '../fetch'
import dotenv from 'dotenv'
dotenv.config()

const fetch = networkHandeler.fetch
const enc = encrpytion({fetch, server: 'http://localhost:' + process.env.Web_Server_Port})

test('Encrpytion is a valid class', t => {
	t.is(typeof enc, 'object')
})

test('Encrpytion class fails when given no arguments', t => {
	t.plan(1)
	try {
		encrpytion()	
	} catch (err) {
		t.pass()
	}
})

test('GenUIR works', t => {
	t.regex(enc.genURI(), /http(s|):\/\/.{0,}[^/]/i)
})

test.cb('genFetchObj works #1 (fails with no key)', t => {
	enc.genFetchObj({test: 'test'})
	.then(out => {
		t.fail('Needs to fail when given key or when there is no saved key')
		t.end()
	})
	.catch(err => {
		t.pass()
		t.end()
	})
})

test.cb('genFetchObj works #2 (no key)', t => {
	enc.genFetchObj({test: 'test'}, {NoEncryption: true})
	.then(out => {
		t.pass()
		t.end()
	})
	.catch(err => {
		t.fail(err)
		t.end()
	})
})

test.cb('genFetchObj works #3 (using `test` as key)', t => {
	enc.genFetchObj({test: 'test'}, {key: 'test'})
	.then(out => {
		t.pass()
		t.end()
	})
	.catch(err => {
		t.fail(err)
		t.end()
	})
})

test.cb('genFetchObj works #4 (using `test` as key and number as post data)', t => {
	enc.genFetchObj(1, {key: 'test'})
	.then(out => {
		t.pass()
		t.end()
	})
	.catch(err => {
		t.fail(err)
		t.end()
	})
})

test.cb('genFetchObj works #5 (using `test` as key and string as post data)', t => {
	enc.genFetchObj('idk', {key: 'test'})
	.then(out => {
		t.pass()
		t.end()
	})
	.catch(err => {
		t.fail(err)
		t.end()
	})
})

test.cb('genFetchObj works #6 (passing a uri to fetch)', t => {
	let testVal = {outputVal: 'some text'}
	let uri = networkHandeler.bind(testVal).uri()
	enc.genFetchObj('idk', {NoEncryption: true}, uri)
	.then(data => {
		t.truthy(data)
		t.is(typeof data, 'object')
		t.is(JSON.stringify(data), JSON.stringify(testVal))
		t.end()
	})
	.then(err => {
		t.fail(err)
		t.end()
	})
})

test.cb('Encrpyt fails when given no args', t => {
	enc.encrypt()
	.then(() => {
		t.fail('promise should fail')
		t.end()
	})
	.catch(() => {
		t.pass()
		t.end()
	})
})

test.cb('Encrpyt data', t => {
	enc.encrypt({test: '123'}, 'someString')
	.then(data => {
		t.is(typeof data, 'string')
		t.is(data.length, 44)
		t.end()
	})
	.catch(err => {
		t.fail(err)
		t.end()
	})
})

let testDataList = [
	'test123',
	{test: 'test'},
	['1', '2'],
	123
]
testDataList.map((testData, index) => {
	let title = (type, i) => `Decrypt data from Encrpyt #${i + 1} (using a ${Array.isArray(type) ? 'array' : typeof type})`
	test.cb(title(testData, index), t => {
		let key = 'someString'
		enc.encrypt(testData, key)
		.then(data => enc.decrypt(data, key))
		.then(data => {
			t.deepEqual(data, testData)
			t.end()
		})
		.catch(err => {
			t.fail(err)
		})
	})
})

test('Random string works', t => {
	t.plan(3)
	let rand = l => enc.randomString(l)
	t.is(rand(10).length, 2048, 'Random string has lenght of 10**2 = 256')
	t.is(rand().length, 256, 'Default random string lenght is 256')
	t.not(rand(), rand(), 'A random string can\'t be 2 times the same')
})

test('Random string blocks to big of a input value', t => {
	t.plan(2)
	t.is(typeof enc.randomString(16), 'object', 'A random string with input 21 sould give an error')
	t.is(typeof enc.randomString(15), 'string', 'The max input for `randomString` sould give a string')
})