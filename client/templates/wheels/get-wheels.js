Template.getWheels.events({
	'click #follow': function(event) {
    	Meteor.call('followUser', this.userId);
    },
    'click #unfollow': function(event) {
    	Meteor.call('unfollowUser', this.userId);
    }
});

Template.getWheels.helpers({
	getFollowStatus: function(id){
    	return Followers.find({followerId: Meteor.userId(), userId: id }).fetch();
    }
});