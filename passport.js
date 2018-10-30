const passport    = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;

const UserModel = require('./model/user');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, cb) {
    // console.log(email, password);
    //Assume there is a DB module pproviding a global UserModel
    return UserModel.findOne({email:email, password: password}).exec()
      .then(user => {
        if (!user) {
          return cb(null, false, {message: 'Incorrect email or password.'});
        }

        return cb(null, user, {
          message: 'Logged In Successfully'
        });
      })
      .catch(err => {
        return cb(err);
      });
  }
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : 'your_jwt_secret'
  },
  function (jwtPayload, cb) {
    console.log('jwtPayload:', jwtPayload);
    //find the user in db if needed
    return UserModel.findOne({_id: jwtPayload._id}).then(user => {
      console.log(user);
      return cb(null, user);
    }).catch(err => {
      console.log('err:', err.message);
      return cb(err);
    });
  }
));
