(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('restify'), require('mongodb')) :
  typeof define === 'function' && define.amd ? define(['restify', 'mongodb'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.restify, global.mongodb));
}(this, (function (restify, mongodb) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var restify__default = /*#__PURE__*/_interopDefaultLegacy(restify);
  var mongodb__default = /*#__PURE__*/_interopDefaultLegacy(mongodb);

  const uri = 'mongodb://root:example@localhost:27017?retryWrites=true&writeConcern=majority';
  const client = new mongodb__default['default'].MongoClient(uri);

  async function initialize() {
    await client.connect();
    client.close();
  }

  async function getUser(userName) {
    try {
      await client.connect();
      const database = client.db('mongo-node-test');
      const users = database.collection('users');
      const query = { name: {
        $regex: userName,
        $options: 'i'
      } };
      const user = await users.findOne(query);
      return user
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }

  initialize();

  var db = {
    getUser
  };

  // import errs from 'restify-errors'

  function respond(req, res, next) {
    res.send('hello ' + req.params.name);
    next();
  }

  var server = restify__default['default'].createServer();
  server.use(restify__default['default'].plugins.queryParser());

  server.get('/hello/:name', respond);
  server.head('/hello/:name', respond);

  server.get('/user', (req, res, next) => {
    const name = req.query['name'];
    db.getUser(name).then(response => {
      res.send(response);
    });
    next();
  });

  server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
  });

})));
