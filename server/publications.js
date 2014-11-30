Meteor.publish('bookmarkCounts', function() {
  return BookmarkCounts.find();
});

Meteor.publish('news', function() {
  return News.find({}, {sort: {date: -1}, limit: 1});
});


Meteor.publish('blankSearch', function() {
  return Wheels.find({}, {sort: {date: -1}});
});

Meteor.publish('recipe', function(name) {
  check(name, String);
  return [
	BookmarkCounts.find({recipeName: name}),
	Activities.find({recipeName: name})
  ];
});

//Modifed

Meteor.publish('latestActivity', function () {
  var followersCursor = Followers.find({followerId: this.userId });
  var usersIds = followersCursor.map(function(p) { return p.userId });
  usersIds.push(this.userId);
  return Activities.find({ userId: { $in: usersIds } },{sort: {date: -1}, limit: 10 } );
});

Meteor.publish('feed', function(id) {
  // check(id, String);
  return [
	Activities.find({userId:this.userId}, {sort: {date: -1}, limit: 10}),
	Wheels.find({userId:this.userId}, {sort: {date: -1} }),
	Comments.find({discussion_id: id}, {sort: {date: -1}, limit: 10})
  ];
});

//FOR GARAGE
Meteor.publish('getUserData', function(id) {
  check(id, String);
  return [
	Activities.find({userId: id}),
	Wheels.find({userId: id}),
	Followers.find({userId: id })
  ];
});

Meteor.publish('getRelatedActivities', function(id) {
  return Activities.find({wheels: id}, {sort: {date: -1}, limit: 20});
});

Meteor.publish('getActivity', function(id) {
  return Activities.find({_id: id});
});

Meteor.publish('getComments', function(id) {
  return Comments.find({discussion_id: id}, {sort: {date: -1}, limit: 100});
});

Meteor.publish('getQuickComments', function(id) {
  return Comments.find({discussion_id: id}, {sort: {date: -1}, limit: 10});
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

Meteor.publish('getLikes', function(id) {
  return Likes.find({activityId: id});
});

Meteor.publish('likesCounts', function() {
  return Likes.find();
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