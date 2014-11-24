// this is an Express app
var express = require('express');
var app = express();

// app middleware/settings
app.enable('trust proxy')
  .use(require('body-parser').json())
  .use(require('body-parser').urlencoded({extended: false}));

// environment and port
var env = process.env.NODE_ENV || 'development';
var port = parseInt(process.argv[2], 10);
if (isNaN(port)) port = 3000;

// development vs production
if (env == "development")
  app.use(require('errorhandler')({dumpExceptions: true, showStack: true}))
else
  app.use(require('errorhandler')())

// actual app
var config = require("./config");
var routes = require("./routes")(app, config);

app.listen(port, function() {console.log("Express server listening on port %s in %s mode", port, env);});
