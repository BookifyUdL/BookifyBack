const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');


//MongoDB connection PATH
mongoose
    .connect("mongodb+srv://test:" +
        process.env.MONGODB_ATLAS_PW + 
        "@test-nodejs-api-pvbee.mongodb.net/test?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
    .then(console.log("DB connected correctly"))
    .catch(err => console.log("DB connection failed")
);

app.use(morgan('dev'));//extra logs of each petition
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Before any request is done we have to "disable" CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*') //second parameter specifies the url that can have acces, no url means all can access.
  //HEADERS YOU WANT TO SUPPORT
  res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authoritzation'
      );
  if(req.method === 'OPTIONS') {
      //HTTP VERBS THAT YOU WANT TO SUPPORT.
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
  }
  next();
});


//Handle all requests errors here, because if I arrive here
// it means that any request has matched with the other file ones.
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error); //forward the error request instead of the original one essentially.
});

//Server errors handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
      error: {
          message: error.message
      }
  });
});

module.exports = app;