Template.getActivity.events({
	'click #follow': function(event) {
    	Meteor.call('followUser', this._id);
    },
    'click #unfollow': function(event) {
    	Meteor.call('unfollowUser', this._id);
    }
});

Template.getActivity.helpers({
	getFollowStatus: function(id){
    	return Followers.find({followerId: Meteor.userId(), userId: id }).fetch();
    }
});
