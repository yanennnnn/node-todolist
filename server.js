const http = require("http");
const { v4: uuidv4 } = require('uuid');
const errorHandle = require('./errorHandle')
const successHandle = require('./successHandle')
const todos = [];
const requestListner = (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Control-Type': 'application/json'
  }
  const findIdIndex = () => {
    const id = req.url.split("/").pop()
    return todos.findIndex( el => el.id === id)
  }
  let body = "";
  req.on("data", chunk => {
    body += chunk;
  })
  if(req.url === "/todos" && req.method === "GET") {
    successHandle(res, todos)
  } else if (req.url === "/todos" && req.method === "POST") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        if (title !== undefined) {
          const todo = {
            "id": uuidv4(),
            "title": title
          }
          todos.push(todo)
          successHandle(res, todos)
        } else {
          errorHandle(res)
        }
      } catch {
        errorHandle(res)
      }
    })
  } else if (req.url === "/todos" && req.method === "DELETE") {
    todos.length = 0;
    successHandle(res, todos)
  } else if (req.url.startsWith("/todos/") && req.method === "PATCH") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        const index = findIdIndex()
        if(!!title && index !== -1) {
          todos[index].title = title;
          successHandle(res, todos)
        } else {
          errorHandle(res)
        }
      } catch {
        errorHandle(res)
      }
    })
  } else if (req.url.startsWith("/todos/") && req.method === "DELETE") {
    const index = findIdIndex()
    if(index !== -1) {
      todos.splice(index, 1)
      successHandle(res, todos)
    } else {
      errorHandle(res)
    }
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "not found",
        message: "無此網站路由"
      })
    );
    res.end();
  }
}

const server = http.createServer(requestListner)

server.listen(process.env.PROT || 3005)