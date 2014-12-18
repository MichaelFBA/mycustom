Subscriptions = new Meteor.Collection('subscriptions');

Subscriptions.allow({
  insert: function(userId, doc) {
    return true;
  }
});
