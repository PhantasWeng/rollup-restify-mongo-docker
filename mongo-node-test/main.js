// import errs from 'restify-errors'
import restify from 'restify'

import db from './db.js'

function respond(req, res, next) {
  res.send('hello ' + req.params.name)
  next()
}

var server = restify.createServer()
server.use(restify.plugins.queryParser())

server.get('/hello/:name', respond)
server.head('/hello/:name', respond)

server.get('/user', (req, res, next) => {
  const name = req.query['name']
  db.getUser(name).then(response => {
    res.send(response)
  })
  next()
})

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url)
})