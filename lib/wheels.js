Wheels = new Meteor.Collection('wheels');


Wheels.allow({
  insert: function(userId, doc) {
    return doc.userId === userId;
  }
});

Meteor.methods({
  createWheels: function(wheels, tweet, loc) {
    check(Meteor.userId(), String);
    check(wheels, {
      recipeName: String,
      text: String,
      image: String
    });
    check(tweet, Boolean);
    check(loc, Match.OneOf(Object, null));
    
    wheels.userId = Meteor.userId();
    wheels.userName = Meteor.user().profile.name;
    wheels.date = new Date;
    
    if (! this.isSimulation && loc)
      wheels.place = getLocationPlace(loc);
    
    var id = Wheels.insert(wheels);
    
    if (! this.isSimulation && tweet)
      tweetWheels(wheels);
    
    return id;
  }
});
