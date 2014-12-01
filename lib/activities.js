Activities = new Mongo.Collection('activities');

Activities.allow({
  insert: function(userId, doc) {
    return doc.userId === userId;
  }
});

Activities.latest = function() {
  return Activities.find({}, {sort: {date: -1}, limit: 1});
}

if (Meteor.isServer) {
  
Meteor.methods({
  createActivity: function(activity, tweet, loc) {
    check(Meteor.userId(), String);
    check(activity, {
      wheels: String,
      description: String,
      image: String
    });
    check(tweet, Boolean);
    check(loc, Match.OneOf(Object, null));
    
    activity.userId = Meteor.userId();
    activity.userAvatar = Meteor.user().profile.picture;
    activity.userName = Meteor.user().profile.name;
    activity.date = new Date;
    
    if (loc){
      activity.place = getLocationPlace(loc);
    }
    
    var id = Activities.insert(activity);
    
    if (tweet){
      tweetActivity(activity);
    }
    
    return id;
  }
});


  // Uses the Npm request module directly as provided by the request local pkg
  var callTwitter = function(options) {
    var config = Meteor.settings.twitter
    var userConfig = Meteor.user().services.twitter;

    options.oauth = {
      consumer_key: config.consumerKey,
      consumer_secret: config.secret,
      token: userConfig.accessToken,
      token_secret: userConfig.accessTokenSecret
    };

    return Request(options);
  }
  
  var tweetActivity = function(activity) {
    // creates the tweet text, optionally truncating to fit the appended text
    function appendTweet(text, append) {
      var MAX = 117; // Max size of tweet with image attached
      
      if ((text + append).length > MAX)
        return text.substring(0, (MAX - append.length - 3)) + '...' + append;
      else
        return text + append;
    }
    
    // we need to strip the "data:image/jpeg;base64," bit off the data url
    var image = activity.image.replace(/^data.*base64,/, '');

    var response = callTwitter({
      method: 'post',
      url: 'https://upload.twitter.com/1.1/media/upload.json',
      form: { media: image }
    });
    
    if (response.statusCode !== 200)
      throw new Meteor.Error(500, 'Unable to post image to twitter');

    var attachment = JSON.parse(response.body);
    
    var response = callTwitter({
      method: 'post',
      url: 'https://api.twitter.com/1.1/statuses/update.json',
      form: {
        status: appendTweet(activity.text, ' #mycustom'),
        media_ids: attachment.media_id_string
      }
    });

    if (response.statusCode !== 200)
      throw new Meteor.Error(500, 'Unable to create tweet');
  }
  
  var getLocationPlace = function(loc) {
    var url = 'http://nominatim.openstreetmap.org/reverse?format=json'
    + '&lat=' + loc.coords.latitude
    + '&lon=' + loc.coords.longitude
    + '&zoom=18&addressdetails=1';

    var result = HTTP.call("GET", url);
    return result && result.data.address.suburb + ', ' +result.data.address.country;
  }
}


