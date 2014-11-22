Meteor.methods({
  updateUser: function(userData) {
    check(Meteor.userId(), String);
    check(userData, {
      'profile.name': String,
      'profile.bio': String,
      'profile.website': String
    });
    var id = Meteor.users.update({_id: Meteor.userId() }, {$set: userData});

    return id;
  }
});