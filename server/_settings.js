// Provide defaults for Meteor.settings
//
// To configure your own Twitter keys, see:
//   https://github.com/meteor/meteor/wiki/Configuring-Twitter-in-Local-Market
if (typeof Meteor.settings === 'undefined')
  Meteor.settings = {};

_.defaults(Meteor.settings, {
  twitter: {
    consumerKey: "x6RsMJSyWP3IsePSeapT0t313", 
    secret: "euB6M6ddvkVPcZ04Ab2tIi90eVXLEFj19o5jaiIsSrU3G99rkj"
  },
  facebook:{
  	appId: "1451011255133475",
  	secret: "eb79e1d17df699145b7beadcbeb1d666"
  }
});

ServiceConfiguration.configurations.remove({
  service: "facebook"
});
ServiceConfiguration.configurations.insert({
  service: "facebook",
  appId: Meteor.settings.facebook.appId,
  secret: Meteor.settings.facebook.secret
});

ServiceConfiguration.configurations.remove({
  service: "twitter"
});
ServiceConfiguration.configurations.insert({
  service: "twitter",
  consumerKey: Meteor.settings.twitter.consumerKey,
  secret: Meteor.settings.twitter.secret
});

process.env.MAIL_URL="smtp://info%40my-custom.com:zxcvbnm0@smtp.gmail.com:465/"; 