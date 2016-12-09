var config      = require("../../config/nconfig");

var accountSid  = config.get('twilio:accountSid');
var authToken   = config.get('twilio:authToken');
var phoneNumber = config.get('twilio:senderNumber');
var countryCode = config.get('twilio:defaultCountryCode');

var twilio      = require('twilio');
var client      = new twilio.RestClient(accountSid, authToken);

module.exports = function(text, recipient) {
    client.messages.create({
        body: text,
        to: countryCode + recipient,
        from: phoneNumber
    }, function(err, message) {
        if (err)
            console.dir(err);
    });
};
