const url = 'http://localhost:3000/'
const foreignStorage = {setItem, getItem, removeItem, clear,
  getLength, listKeys}

async function setItem(key, str) {
  if (arguments.length < 2 || typeof key != 'string' || typeof str != 'string') {
    throw new Error('Exactly two arguments of type string required')
  }
  const answer = await fetch(url + 'setItem', {method: 'POST', headers: {key}, body: str})
    .then(resp => resp.json())

  if (answer.success) return true
  throw new Error(answer.errors?.join('; ') || answer)
}

async function getItem(key) {
  if (arguments.length < 1 || typeof key != 'string') {
    throw new Error('One argument of type string required')
  }
  const answer = await fetch(url + 'getItem', {method: 'GET', headers: {key}})
    .then(resp => resp.json())

  if (answer.errors?.[0] == 'undefined') return undefined
  return answer
}

async function removeItem(key) {
  if (arguments.length < 1 || typeof key != 'string') {
    throw new Error('One argument of type string required')
  }
  return fetch(url + 'removeItem', {method: 'DELETE', headers: {key}})
    .then(resp => resp.json())
}

async function clear() {
  return fetch(url + 'clear', {method: 'DELETE'})
    .then(resp => resp.json())
}

async function getLength() {
  return fetch(url + 'getLength')
    .then(resp => resp.json())
}

async function listKeys() {
  return fetch(url + 'listKeys')
    .then(resp => resp.json())
}
