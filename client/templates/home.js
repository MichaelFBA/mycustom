
Template.home.helpers({
  
  activities: function() {
    return Activities.find();
  },
  
  latestNews: function() {
    return News.latest();
  }
});