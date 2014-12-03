Template.notifications.events({
	'click .alert-box': function (event) {
		Notifications.update({_id:this._id}, { $set: { isRead : true  } })
	}
});

Template.notifications.helpers({
	getNotifications: function () {
		return Notifications.find({recipientId: Meteor.userId() }, {sort: {date: -1}});
	}
});