// app/oauth2.js

var config = require('./nconf');

var oauth2orize = require('oauth2orize');
var passport = require('passport');
var crypto = require('crypto');

// Models
var UserModel = require('../models/user');
var ClientModel = require('../models/oauth2-client');
var AccessTokenModel = require('../models/oauth2-access-token');
var RefreshTokenModel = require('../models/oauth2-refresh-token');

// create OAuth 2.0 server
var server = oauth2orize.createServer();

// Exchange username & password for access token.
server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {
  UserModel.findOne({
    "local.email": username
  }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    if (!user.validPassword(password)) {
      return done(null, false);
    }

    RefreshTokenModel.remove({
      userId: user.userId,
      clientId: client.clientId
    }, function(err) {
      if (err) return done(err);
    });
    AccessTokenModel.remove({
      userId: user.userId,
      clientId: client.clientId
    }, function(err) {
      if (err) return done(err);
    });

    var tokenValue = crypto.randomBytes(32).toString('base64');
    var refreshTokenValue = crypto.randomBytes(32).toString('base64');
    var token = new AccessTokenModel({
      token: tokenValue,
      clientId: client.clientId,
      userId: user.userId
    });
    var refreshToken = new RefreshTokenModel({
      token: refreshTokenValue,
      clientId: client.clientId,
      userId: user.userId
    });
    refreshToken.save(function(err) {
      if (err) {
        return done(err);
      }
    });
    var info = {
      scope: '*'
    }
    token.save(function(err, token) {
      if (err) {
        return done(err);
      }
      done(null, tokenValue, refreshTokenValue, {
        'expires_in': config.get('security:tokenLife')
      });
    });
  });
}));

// Exchange refreshToken for access token.
server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) {
  RefreshTokenModel.findOne({
    token: refreshToken
  }, function(err, token) {
    if (err) {
      return done(err);
    }
    if (!token) {
      return done(null, false);
    }
    if (!token) {
      return done(null, false);
    }

    UserModel.findById(token.userId, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }

      RefreshTokenModel.remove({
        userId: user.userId,
        clientId: client.clientId
      }, function(err) {
        if (err) return done(err);
      });
      AccessTokenModel.remove({
        userId: user.userId,
        clientId: client.clientId
      }, function(err) {
        if (err) return done(err);
      });

      var tokenValue = crypto.randomBytes(32).toString('base64');
      var refreshTokenValue = crypto.randomBytes(32).toString('base64');
      var token = new AccessTokenModel({
        token: tokenValue,
        clientId: client.clientId,
        userId: user.userId
      });
      var refreshToken = new RefreshTokenModel({
        token: refreshTokenValue,
        clientId: client.clientId,
        userId: user.userId
      });
      refreshToken.save(function(err) {
        if (err) {
          return done(err);
        }
      });
      var info = {
        scope: '*'
      }
      token.save(function(err, token) {
        if (err) {
          return done(err);
        }
        done(null, tokenValue, refreshTokenValue, {
          'expires_in': config.get('security:tokenLife')
        });
      });
    });
  });
}));


// token endpoint
exports.token = [
  passport.authenticate(['basic', 'oauth2-client-password'], {
    session: false
  }),
  server.token(),
  server.errorHandler()
]
