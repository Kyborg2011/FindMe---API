var oauth2 = require('../helpers/auth');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var UserModel = require('../models/user');
var ClientModel = require('../models/oauth2-client');
var LocationMessage = require('../models/latecomer-message');
var Message = require('../models/message');
var AccessTokenModel = require('../models/oauth2-access-token');
var RefreshTokenModel = require('../models/oauth2-refresh-token');

module.exports = function(app, passport) {

  /* RESTful API status page */
  app.get('/api', function(req, res) {
    var message = new LocationMessage({
      isAccepted: 355
    });
    message.save();
    ClientModel.find({}, function(err, users) {
      return res.send({'users': 'aaaaa'});
    });


  });

  /* User login (getting of access token) */
  app.post('/oauth/token', oauth2.token);

  // User signup
  // Linking with Google or Facebook
  app.post('/api/users', passport.authenticate('local-signup', {
      session: false
    }),
    function(req, res) {
      res.status(200);
      res.send({
        signup: "success"
      });
    });

  // Activate new user
  app.post('/api/users/activate', function(req, res, next) {
    UserModel.findOne({
      'local.email': req.body.email
    }, function(err, userObj) {
      if (userObj != null) {
        if (bcrypt.compareSync(req.body.code, userObj.local.activation_code)) {
          userObj.local.active = 1;
          userObj.save();
          return res.status(200).send(userObj);
        } else {
          return res.status(200).send({
            error: "Invalid code"
          });
        }
      } else {
        return res.status(200).send({
          error: "E-mail doesn't exist"
        });
      }

    });
  });

  app.get('/auth/google',
    passport.authenticate('google', {
      session: false,
      scope: ['https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.profile.emails.read'
      ]
    }));

  app.get('/auth/google/callback',
    passport.authenticate('google', {
      session: false,
      failureRedirect: '/auth/google'
    }),
    function(req, res) {
      res.redirect("/api?access_token=" + req.user.access_token);
    });

  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      session: false
    }));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/auth/facebook',
      session: false,
    }),
    function(req, res) {
      res.redirect("/api?access_token=" + req.user.access_token);
    });

  /* Password recovery */
  app.post('/api/users/recovery', function(req, res, next) {
    UserModel.findOne({
      'local.email': req.body.email
    }, function(err, userObj) {
      if (userObj != null) {
        const buf = crypto.randomBytes(6);
        var cryptoString = buf.toString('hex');
        var hash = bcrypt.hashSync(cryptoString, bcrypt.genSaltSync(8), null);

        sms("New password: " + cryptoString, userObj.local.phone);
        userObj.local.password = hash;
        userObj.save();

        return res.status(200).send(userObj);
      } else {
        return res.status(200).send({
          error: "E-mail doesn't exist"
        });
      }
    });
  });

  /* Set user's Firebase refresh token */
  app.post('/api/users/save_firebase_token', passport.authenticate('bearer', {
      session: false
    }),
    function(req, res, next) {
      var firebaseToken = req.body.firebase_token;
      if (firebaseToken != null) {
        req.user.local.firebase_token = firebaseToken;
        req.user.save();
        return res.status(200).send(req.user.local);
      } else {
        return res.status(200).send({
          error: "No firebase token passed"
        });
      }
    });

  /* User logout */
  app.get('/api/logout', function(req, res) {
    req.logout();
    res.redirect('/api');
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/api');
}
