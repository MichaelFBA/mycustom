Comments = new Mongo.Collection('comments');

Comments.allow({
  insert: function(userId, doc) {
    return doc.userId === userId;
  }
});

Meteor.methods({
  createComment: function(comment) {
    check(Meteor.userId(), String);
    check(comment, {
      text: String,
      discussion_id: String,
    });
    
    comment.userId = Meteor.userId();
    comment.userAvatar = Meteor.user().profile.picture;
    comment.userName = Meteor.user().profile.name;
    comment.date = new Date;
   
    
    var id = Comments.insert(comment);
    return id;
  }
});