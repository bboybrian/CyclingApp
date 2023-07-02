var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const sql = require('mssql')
var fileupload = require("express-fileupload");
require('dotenv').config();
// var passport = require('passport');
// const csrf = require('csurf'); //csrf protection
// const flash = require('connect-flash'); //flash error messages to users
// const multer = require('multer') //file upload

const errorController = require('./controllers/error');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var athletesRouter = require('./routes/athletes');
var coachRouter = require('./routes/coach');

const config = {
    authentication: {
      options: {
        userName: process.env.DB_USER,
        password: process.env.DB_PWD
      },
      type: "default"
    },
    server: process.env.DB_SERVER,
    options: {
      database: process.env.DB_NAME,
      encrypt: true
    }
};

// create a 'pool' (group) of connections to be used for connecting with our SQL server
// const dbConnectionPool = new Connection(config);
const dbConnectionPool =new sql.ConnectionPool(config)
    .connect()
    .then (pool =>{
        console.log("connected")
        return pool
    })
    .catch(err => console.log("failed to connect", err)); 


// var sessionStore = new MySQLStore({}, dbConnectionPool);

var app = express();

// const csrfProtection = csrf();

// file upload - multer 
// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'files');
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + '-' + file.originalname);
//   }
// });
//
// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === 'application/gpx+xml'
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// ejs engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Enabled headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  // Set allowed server methods
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Set access control headers
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // Set allowed cookies
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

app.use(fileupload());

// apply session for every single request
app.use(session({
    secret: 'hello im cute',
    resave: false,
    saveUninitialized: true,
    // store: sessionStore,
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: (24*60*60*1000),
    },
}));

// app.use(csrfProtection);
// app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(obj, done) {
//   done(null, obj);
// });

// Middleware for accessing database: We need access to the database to be available *before* we process routes in index.js,
// so this code needs to be *before* the app.use('/', routes);
// Express will run this function on every request and then continue with the next module, index.js.
// So for all requests that we handle in index.js, we’ll be able to access the pool of connections using req.pool

app.use(function(req, res, next) {
    req.pool = dbConnectionPool;
    next();
});

// authentication middleware
app.use(logger('dev'));

app.use(express.json()); // detects json object and pass it as js object
app.use(express.urlencoded({ extended: false })); // urlencoded form
// app.use(cookieParser());

// file upload - multer
// app.use(
//   multer({ storage: fileStorage, fileFilter: fileFilter }).single('files')
// );

app.use('/coach', coachRouter);
app.use('/athletes', athletesRouter);
app.use('/users', usersRouter);
app.use('/', indexRouter);

app.use(express.static(path.join(__dirname, 'public')));

// error page
app.get('/500', errorController.get500);
app.use(errorController.get404);

app.listen(8080, () => {
    console.log(`App listening on port 8080`)
});

module.exports = app;