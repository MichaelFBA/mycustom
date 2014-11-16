Meteor.publish('bookmarkCounts', function() {
  return BookmarkCounts.find();
});

Meteor.publish('news', function() {
  return News.find({}, {sort: {date: -1}, limit: 1});
});

Meteor.publish('latestActivity', function () {
  // return Activities.latest();
  return Activities.find({}, {sort: {date: -1}, limit: 10});
});

Meteor.publish('feed', function() {
  return Activities.find({}, {sort: {date: -1}, limit: 10});
});

Meteor.publish('blankSearch', function() {
  return Activities.find({}, {sort: {date: -1}, limit: 10});
});

Meteor.publish('recipe', function(name) {
  check(name, String);
  return [
    BookmarkCounts.find({recipeName: name}),
    Activities.find({recipeName: name})
  ];
});

//Modifed

Meteor.publish('getUserData', function(id) {
  check(id, String);
  return [
    Activities.find({userId: id}),
    Wheels.find({userId: id})
  ];
});

Meteor.publish('getRelatedActivities', function(id) {
  return Activities.find({wheels: id}, {sort: {date: -1}, limit: 20});
});


Meteor.publish('wheels', function() {
  return Wheels.find({userId:this.userId}, {sort: {date: -1} });
})

Meteor.publish('getWheels', function(id) {
  return Wheels.find({_id: id });
})

Meteor.publish('getUser', function(id) {
  return Meteor.users.find({_id: id});
});

// autopublish the user's bookmarks and admin status
Meteor.publish(null, function() {
  return Meteor.users.find(this.userId, {
    fields: {
      admin: 1,
      bookmarkedRecipeNames: 1,
      'services.twitter.profile_image_url_https': 1
    }
  });
})