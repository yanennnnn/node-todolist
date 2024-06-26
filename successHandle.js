function successHandle (res, data) {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Control-Type': 'application/json'
  }
  res.writeHead(200, headers)
  res.write(JSON.stringify({
    "status": "success",
    "data": data
  }))
  res.end()
}

module.exports = successHandle