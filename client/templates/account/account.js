Template.account.helpers({
  recipeCount: function() {
    return pluralize(this.length, 'recipe');
  },
  getMedia: function(id) {
    return Activities.find({userId: id }).count();
  },
  getWheels: function(id) {
    return Wheels.find({userId: id }).count();
  },
  getFollowers: function(id) {
    return Activities.find({userId: id }).count();
  },
  getFollowing: function(id ) {
    return Activities.find({userId: id }).count();
  },

});