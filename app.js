var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const auth = require('./routes/auth');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport    = require('passport');
const storeSampleUser = require('./SampleUser').storeSampleUser;
require('./passport');
const MongodbMemoryServer = require('mongodb-memory-server').default;
let mongoServer;
const opts = { useNewUrlParser: true, keepAlive: true/* useMongoClient: true */ }; // remove this option if you use mongoose 5 and above

mongoose.Promise = Promise;

mongoServer = new MongodbMemoryServer();
mongoServer.getConnectionString().then((mongoUri) => {
  return mongoose.connect(mongoUri, opts, async (err) => {
    if (err) {
      done(err);
    }
    await storeSampleUser();
    const Users = require('./model/user');
    Users.find({}).exec().then(users => console.log(users));
    console.log('Mongoose Memory Server linked at: ' + mongoUri);
    // nconf.overrides({mongoConnectStr: mongoUri});
  });
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', passport.authenticate('jwt', {session: false}), usersRouter);
app.use('/auth', auth);

// app.use(function(req, res, next) {
//   mongoServer.getConnectionString().then((mongoUri) => {
//     return mongoose.connect(mongoUri, opts, (err) => {
//       if (err) {
//         done(err);
//       }
//       console.log('Mongoose Memory Server linked at: ' + mongoUri);
//       nconf.overrides({mongoConnectStr: mongoUri});
//     });
//   })
//   next();
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
