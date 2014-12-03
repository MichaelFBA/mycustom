Template.activity.rendered = function() {
	// var self = this;

	// // If the activity is in a list, scroll it into view. Note, we can't just use
	// // element.scrollIntoView() because it attempts to scroll in the X direction
	// // messing up our animations
	// if (Router.current().params.activityId === self.data._id) {
	// 	var $activity = $(self.firstNode);
	// 	var top = $activity.offset().top;
	// 	var $parent = $(self.firstNode).closest('.content-scrollable');
	// 	var parentTop = $parent.offset().top;
	// 	$parent.scrollTop(top - parentTop);
	// }
}

Template.activity.helpers({
	// path: function() {
	// 	return Router.path('recipe', { name: this.recipeName}, { query: { activityId: this._id } })
	// },
	likeNames: function(id){
		return Likes.find({activityId : this._id});
	},
	getComments: function(id) {
		Meteor.subscribe('getComments', id , function(result){
			console.log('subscribed')
		});
		return Comments.find({ discussion_id: id });
	},
	likeCount:function(){
		return Likes.find({activityId : this._id}).count();
	},
	commentCount:function(id){
		Meteor.subscribe('getComments', id , function(result){
			console.log('subscribed')
		});
		return Comments.find({discussion_id : this._id}).count();
	},
	isliked : function(){
		return Likes.find({activityId: this._id, likedById: Meteor.userId()  }).fetch();
	}
})

Template.activity.events({
	'click #like': function(event) {
		event.preventDefault();
		Meteor.call('likeActivity', this._id);

		var notification = {
			recipientId : this.userId,
			activityType: 'like',
			objectId: this._id,
			objectType: 'activity'
		}
		Meteor.call('createNotification', notification);
	},
	'click #unlike': function(event) {
		Meteor.call('unlikeActivity', this._id);

		var notification = {
			recipientId : this.userId,
			activityType: 'like',
			objectId: this._id,
			objectType: 'activity'
		}
        Meteor.call('removeNotification', notification);
	}
});

