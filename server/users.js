Accounts.onCreateUser(function(options, user) {
  if (options.profile)
    user.profile = options.profile;

	if(user.services.facebook) {
        options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=square&height=300&width=300";
        user.profile = options.profile;
        user.profile.name = user.services.facebook.name;
   }
   if (user.services.twitter) {
        options.profile.picture = user.services.twitter.profile_image_url_https
        user.profile = options.profile;
    }

  // If this is the first user going into the database, make them an admin
  if (Meteor.users.find().count() === 0)
    user.admin = true;

  return user;
});
