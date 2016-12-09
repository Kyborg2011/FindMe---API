// config/passport.js
var config = require('./nconfig');

var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var sms = require('../app/controllers/sms');

// load authentication strategies
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up models
var User = require('../app/models/user');
var Client = require('../app/models/client');
var AccessToken = require('../app/models/accesstoken');
var RefreshToken = require('../app/models/refreshtoken');

module.exports = function(passport) {
    /* Basic authentication pop-up */
    passport.use(new BasicStrategy(
        function(username, password, done) {
            Client.findOne({
                clientId: username
            }, function(err, client) {
                if (err) {
                    return done(err);
                }
                if (!client) {
                    return done(null, false);
                }
                if (client.clientSecret != password) {
                    return done(null, false);
                }

                return done(null, client);
            });
        }
    ));
    /* Check clientId + clientSecret for existence */
    passport.use(new ClientPasswordStrategy(
        function(clientId, clientSecret, done) {
            console.log(clientId);
            Client.findOne({
                clientId: clientId
            }, function(err, client) {
                if (err) {
                    return done(err);
                }
                if (!client) {
                    return done(null, false);
                }
                if (client.clientSecret != clientSecret) {
                    return done(null, false);
                }

                return done(null, client);
            });
        }
    ));
    /* Check access token */
    passport.use(new BearerStrategy(
        function(accessToken, done) {
            AccessToken.findOne({
                token: accessToken
            }, function(err, token) {
                if (err) {
                    return done(err);
                }
                if (!token) {
                    User.findOne({
                            access_token: accessToken
                        },
                        function(err, user) {
                            if (err) {
                                return done(err)
                            }
                            if (!user) {
                                return done(null, false)
                            }

                            return done(null, user, {
                                scope: 'all'
                            })
                        }
                    );
                } else {
                    if (Math.round((Date.now() - token.created) / 1000) >
                        config.get('security:tokenLife')) {
                        AccessToken.remove({
                            token: accessToken
                        }, function(err) {
                            if (err) return done(err);
                        });
                        return done(null, false, {
                            message: 'Token expired'
                        });
                    }
                    User.findById(token.userId, function(err, user) {
                        if (err) {
                            return done(err);
                        }
                        if (!user) {
                            return done(null, false, {
                                message: 'Unknown user'
                            });
                        }

                        var info = {
                            scope: '*'
                        }
                        done(null, user, info);
                    });
                }
            });
        }
    ));
    /* Google OAuth2.0 Strategy */
    passport.use(new GoogleStrategy({
            clientID: config.get("oauth:google:clientId"),
            clientSecret: config.get("oauth:google:clientSecret"),
            callbackURL: config.get("mainDomain") + "/auth/google/callback",
            passReqToCallback: true,
            session: false
        },
        function(request, accessToken, refreshToken, profile, done) {
            User.findOne({
                'google.id': profile.id
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    var newUser = new User();
                    if (profile.emails.length > 0)
                        newUser.local.email = profile.emails[0].value;
                    newUser.local.full_name = profile.displayName;
                    newUser.local.active = 1;
                    newUser.google.id = profile.id
                    newUser.access_token = accessToken;
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                } else {
                    user.access_token = accessToken;
                    user.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });
                    return done(err, user);
                }
            });
        }
    ));
    // Facebook oAuth2 Strategy
    passport.use(new FacebookStrategy({
            clientID: config.get("oauth:facebook:clientId"),
            clientSecret: config.get("oauth:facebook:clientSecret"),
            callbackURL: config.get("mainDomain") + "/auth/facebook/callback",
            passReqToCallback: true,
            profileFields: ['id', 'displayName', 'email'],
            session: false
        },
        function(request, accessToken, refreshToken, profile, cb, done) {
            console.dir(profile);
            User.findOne({
                'facebook.id': profile.id
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    var newUser = new User();
                    newUser.local.active = 1;
                    newUser.local.full_name = profile.displayName;
                    newUser.local.email = profile.email;
                    newUser.facebook.id = profile.id
                    newUser.access_token = accessToken;
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                } else {
                    user.access_token = accessToken;
                    user.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });
                    return done(err, user);
                }
            });
        }
    ));
    /* Sign Up */
    passport.use('local-signup', new LocalStrategy({
            /* by default, local strategy uses username and password,
               we will override with email */
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            /* asynchronous
               User.findOne wont fire unless data is sent back */
            process.nextTick(function() {
                User.findOne({
                    'local.email': email
                }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false);
                    } else {
                        /* Creation of new user */
                        var newUser = new User();
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.local.full_name = req.body.full_name;
                        newUser.local.phone = req.body.phone;
                        newUser.local.active = 0;
                        const buf = crypto.randomBytes(3);
                        var cryptoString = buf.toString('hex');
                        var hash = bcrypt.hashSync(cryptoString,
                            bcrypt.genSaltSync(8), null);
                        sms("Verification code: " +
                            cryptoString, newUser.local.phone);
                        newUser.local.activation_code = hash;
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }
    ));
};
