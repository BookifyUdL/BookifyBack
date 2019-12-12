const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
require('./api/config/passport');

const userRoutes = require('./api/routes/userRoutes');
const bookRoutes = require('./api/routes/bookRoutes');
const authorRoutes = require('./api/routes/authorRoutes');
const commentRoutes = require('./api/routes/commentRoutes');
const reviewRoutes = require('./api/routes/reviewRoutes');
const genreRoutes = require('./api/routes/genreRoutes');
const achievementRoutes = require('./api/routes/achievementRoutes');
const shopRoutes = require('./api/routes/shopRoutes');
const itemRoutes = require('./api/routes/itemRoutes');
const adminRoutes = require('./api/routes/adminRoutes');
const statisticsRoutes = require('./api/routes/statisticsRoutes');



//MongoDB connection PATH
mongoose
    .connect("mongodb+srv://admin:" +
        process.env.MONGODB_ATLAS_PW +
        "@cluster0-nxv9z.mongodb.net/test?retryWrites=true&w=majority",
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
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());


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

app.use('/users', userRoutes);
app.use('/books', bookRoutes);
app.use('/authors', authorRoutes);
app.use('/genres', genreRoutes);
app.use('/achievements', achievementRoutes);
app.use('/comments', commentRoutes);
app.use('/reviews', reviewRoutes);
app.use('/shops', shopRoutes);
app.use('/items', itemRoutes);
app.use('/admin', adminRoutes);
app.use('/statistics', statisticsRoutes);

//Handle all requests errors here, because if I arrive here
// it means that any request has matched with the other file ones.
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error); //forward the error request instead of the original one essentially.
});

//Server errors handler
app.use((error, req, res, next) => {
    console.log(error);
  res.status(error.status || 500);
  res.json({
      error: {
          message: error.message
      }
  });
});

module.exports = app;
