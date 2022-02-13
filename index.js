const { createServer } = require('http')

const server = createServer(handleRequest)
const port = process.env.PORT || 3000
const rootPath = process.env.ROOT_PATH || `http://localhost:${port}/`

server.listen(port, notifyOnStart)

function notifyOnStart() {
  console.log("Server started at http://localhost:" + port)
}

async function handleRequest(req, resp) {
  resp.setHeader('Content-Type', 'application/json; charset=utf-8')
  resp.setHeader('Access-Control-Allow-Origin', '*')
  resp.setHeader('Access-Control-Allow-Headers', 'POST, GET, DELETE, OPTIONS, key')

  const { method, url } = req

  const route = router[url.slice(1)]


  if (!route) {
    var answer = {errors: ['wrong URL ' + url], correctURLs: signPost}
  } else if (route.method != method) {
    var answer =
      {errors: [`wrong method ${method} for ${url}, should be ${route.method}`]}
  } else {
    if (route.length > 0) {
      var {key} = req.headers
    }
    if (route.length > 1) {
      const chunks = []
      for await (const chunk of req) chunks.push(chunk)
      var str = Buffer.concat(chunks).toString()
    }
    var answer = await route(key, str)
  }

  resp.end(JSON.stringify(answer))
}

const router = {setItem, getItem, removeItem, clear,
  getLength, listKeys}

const signPost =
  Object.fromEntries(Object.keys(router).map(key => [key, rootPath+key]))

let storage = {}

setItem.method = 'POST'
async function setItem(key, str) {
  storage[key] = str
  return {success: true}
}

getItem.method = 'GET'
async function getItem(key) {
  return storage[key] || {errors: ['undefined']}
}

removeItem.method = 'DELETE'
async function removeItem(key) {
  delete storage[key]
  return {success: true}
}

clear.method = 'DELETE'
async function clear() {
  storage = {}
  return {success: true}
}

getLength.method = 'GET'
async function getLength() {
  return Object.keys(storage).length
}

listKeys.method = 'GET'
async function listKeys() {
  return Object.keys(storage)
}
