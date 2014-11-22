Followers = new Meteor.Collection('followers');

Meteor.methods({
  'followUser': function(who) {
    check(this.userId, String);
    check(who, String);
    Followers.insert({userId: who, followerId: this.userId });
  },
  'unfollowUser': function(who) {
    check(this.userId, String);
    check(who, String);
    Followers.remove({userId: who, followerId: this.userId });
	}
});