var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var database = require('../config/database'); // load the database config
var store = new MongoDBStore({
  uri: database.localUrl,
  collection: 'Sessions'
});

// Catch errors
store.on('error', function(error) {
  assert.ifError(error);
  assert.ok(false);
});

module.exports = function(app) {

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  app.use(require('express-session')({
    secret: 'rhisismegasicretsexychambelain',
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
      name: 'laxsupercookie',
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  }));

  require('./controllers/votesController.js')(app, session);

};
