Likes = new Meteor.Collection('likes');

Meteor.methods({
  'likeActivity': function(id) {
    check(this.userId, String);
    check(id, String);
    Likes.insert({activityId: id, likedById: this.userId });
  },
  'unlikeActivity': function(id) {
    check(this.userId, String);
    check(id, String);
    Likes.remove({activityId: id, likedById: this.userId });
	}
});