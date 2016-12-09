var gcm = require('node-gcm');
var config = require("../../config/nconfig");
var mongoose = require('mongoose');
var UserModel = require('../models/user');

var sender = new gcm.Sender(config.get('firebase:notifications:server_key'));

module.exports = function(state, userId) {
            var message = new gcm.Message();

            message.addData({
	               lng: state.lng,
	               lat: state.lat,
                   battery_level: state.battery_level,
                   object_id: state.object
            });

            UserModel.findOne({ _id: userId }, function(err, user) {
                if (user != null) {
                    var registrationTokens = [];
                    registrationTokens.push(user.local.firebase_token);

                    sender.sendNoRetry(message, { registrationTokens: registrationTokens },
                        function(err, response) {
                        if(err) console.error(err);
                        else    console.log(response);
                    });
                }
            });
};
