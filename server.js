﻿require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('_helpers/error-handler');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Expose-Headers", "Content-Disposition")
  next();
});


// api routes
app.use('/authentication', require('./authentication/authentication.controller'))
app.use('/users', require('./users/users.controller'));
app.use('/business', require('./business/business.controller'));
app.use('/files', require('./files/files.controller'));
app.use('/jobpost', require('./jobpost/jobpost.controller'));
app.use('/application', require('./application/application.controller'));

// global error handler
app.use(errorHandler);

// start server

if (process.env.NODE_ENV === 'production'){
  app.use(express.static('client/dist'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}


const port = process.env.PORT || 4000;

const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
