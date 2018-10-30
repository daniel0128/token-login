const express = require('express');
const router  = express.Router();

const jwt      = require('jsonwebtoken');
const passport = require('passport');
require('../passport');

/* POST login. */
router.post('/login', function (req, res, next) {
  console.log('request body:');
  console.log(req.body);
  passport.authenticate('local', {session: false}, (err, user, info) => {
    console.log('err:', err);
    console.log('user:', user);
    console.log('info:', info);
    if (err || !user) {
      return res.status(400).json({
          message: info ? info.message : 'Login failed',
          user   : user
      });
    }

    req.login(user, {session: false}, (err) => {
      if (err) {
          res.send(err);
      }

      // user or user._doc
      const token = jwt.sign(user._doc, 'your_jwt_secret');

      return res.json({user, token});
    });
  })(req, res, next);

});

module.exports = router;
