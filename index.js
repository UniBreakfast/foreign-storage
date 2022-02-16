const { GoogleSpreadsheet } =
  require('google-spreadsheet');
try { require('./env') } catch {}

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
  resp.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE, OPTIONS')

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
    var answer = await route(key, str).catch(err => ({errors: [err]}))
  }

  resp.end(JSON.stringify(answer))
}

const router = {setItem, getItem, removeItem, clear,
  getLength, listKeys}

const signPost =
  Object.fromEntries(Object.keys(router).map(key => [key, rootPath+key]))

setItem.method = 'POST'
async function setItem(key, str) {
  const sheet = await promisedSheet
  const rows = await sheet.getRows()
  const row = rows.find(row => row.key == key)
  if (row) {
    row.value = str
    await row.save(rawMark)
  } else {
    await sheet.addRow({key, value: str}, rawMark)
  }
  return {success: true}
}

getItem.method = 'GET'
async function getItem(key) {
  const sheet = await promisedSheet
  const rows = await sheet.getRows()
  const row = rows.find(row => row.key == key)
  return row?.value ?? {errors: ['undefined']}
}

removeItem.method = 'DELETE'
async function removeItem(key) {
  const sheet = await promisedSheet
  const rows = await sheet.getRows()
  await rows.find(row => row.key == key)?.del()
  return {success: true}
}

clear.method = 'DELETE'
async function clear() {
  const sheet = await promisedSheet
  await sheet.clear()
  await sheet.setHeaderRow(['key', 'value'])
  return {success: true}
}

getLength.method = 'GET'
async function getLength() {
  const sheet = await promisedSheet
  const cellDataRanges = await sheet.getCellsInRange('A2:A')
  return cellDataRanges.length
}

listKeys.method = 'GET'
async function listKeys() {
  const sheet = await promisedSheet
  const cellDataRanges = await sheet.getCellsInRange('A2:A')
  return cellDataRanges.map(([key]) => key)
}

const sheetID = "16IjzXrXl7W7zXp_SZcLqT0V_rj79TsUGQLM8HLtSUBk";
const sheetStore = new GoogleSpreadsheet(sheetID);

const promisedSheet = initSheetStore()

promisedSheet.then(notifyOnSheetConnect)

async function initSheetStore() {
  await sheetStore.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });

  await sheetStore.loadInfo();

  const sheet = sheetStore.sheetsByIndex[0];

  return sheet
}

function notifyOnSheetConnect() {
  console.log(`Connected to ${sheetStore.title} sheet at https://docs.google.com/spreadsheets/d/${sheetID}`)
}

const rawMark = { raw: true };

// OBSOLETE?
// promisedSheet.then(sheet => expose({sheet}))
// expose({router})
// function expose(...objects) {
//   objects.forEach(obj =>
//     Object.entries(obj).forEach(([key, value]) =>
//       globalThis[key] = value))
// }
