import fetch from 'unfetch'
import encryption from '../../../../shared/encryption'

let enc = encryption({
  fetch,
  server: ''
})