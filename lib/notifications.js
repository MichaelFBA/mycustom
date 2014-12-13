Notifications = new Mongo.Collection('notifications');

Notifications.allow({
  update: function (userId, doc, fields, modifier) {
    return fields == 'isRead';
  },
  remove: function(){
    return true;
  }
});

Meteor.methods({
  createNotification: function(notification) {
    check(Meteor.userId(), String);
    check(notification, {
      recipientId: String,
      activityType: String,
      objectId: String,
      objectType: String
    });
    
    notification.isRead = false;
    notification.senderId = Meteor.userId();
    notification.senderAvatar = Meteor.user().profile.picture;
    notification.senderName = Meteor.user().profile.name;
    notification.date = new Date;
    
    var id = Notifications.insert(notification);
    return id;
  },

  removeNotification: function(notification){
    check(notification, {
      recipientId: String,
      activityType: String,
      objectId: String,
      objectType: String
    });
    Notifications.remove(notification);
  }

});

// _id
// recipientId
// senderId
// activityType ('like','comment' 'follower', 'activity', 'custom') 
// objectId (to provide a direct id to the object of the notification in HTML)
// objectType ('activity', 'wheels', 'comments','garage')
// date
// isRead 
