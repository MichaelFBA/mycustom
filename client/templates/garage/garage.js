var TAB_KEY = 'feed';

Template.garage.created = function() {
    if (Router.current().params.activityId)
        Template.garage.setTab('feed');
    else
        Template.garage.setTab('garage');
}

Template.garage.rendered = function() {
    this.$('.garage').touchwipe({
        wipeDown: function() {
            if (Session.equals(TAB_KEY, 'garage'))
                Template.garage.setTab('custom')
        },
        preventDefaultEvents: false
    });
    this.$('.attribution-garage').touchwipe({
        wipeUp: function() {
            if (!Session.equals(TAB_KEY, 'garage'))
                Template.garage.setTab('garage')
        },
        preventDefaultEvents: false
    });
}

// CSS transitions can't tell the difference between e.g. reaching
//   the "custom" tab from the expanded state or the "feed" tab
//   so we need to help the transition out by attaching another
//   class that indicates if the feed tab should slide out of the
//   way smoothly, right away, or after the transition is over
Template.garage.setTab = function(tab) {
    var lastTab = Session.get(TAB_KEY);
    Session.set(TAB_KEY, tab);

    var fromGarage = (lastTab === 'garage') && (tab !== 'garage');
    $('.feed-scrollable').toggleClass('instant', fromGarage);

    var toGarage = (lastTab !== 'garage') && (tab === 'garage');
    $('.feed-scrollable').toggleClass('delayed', toGarage);
}

Template.garage.helpers({
    notificationCount: function(){
        return Notifications.find({recipientId: Meteor.userId(), isRead:false }).count()
    }, 
    isActiveTab: function(name) {
        return Session.equals(TAB_KEY, name);
    },
    activeTabClass: function() {
        return Session.get(TAB_KEY);
    },
    bookmarked: function() {
        return Meteor.user() && _.include(Meteor.user().bookmarkedRecipeNames, this.name);
    },
    activities: function() {
        return Activities.find({
            recipeName: this.name
        }, {
            sort: {
                date: -1
            }
        });
    },
    getMedia: function(id) {
        return Activities.find({
            userId: id
        }).count();
    },
    getWheelsCount: function(id) {
        return Wheels.find({
            userId: id
        }).count();
    },
    getWheels: function(id) {
        return Wheels.find({
            userId: id
        });
    },
    getFollowers: function(id) {
        return Followers.find({userId:id}).count()
    },
    getFollowing: function(id) {
        return 0;
    },
    getFollowStatus: function(id){
    	return Followers.find({followerId: Meteor.userId(), userId: id }).fetch();
    }
});

Template.garage.events({
    'click .js-add-bookmark': function(event) {
        event.preventDefault();

        if (!Meteor.userId())
            return Overlay.open('authOverlay');

        Meteor.call('bookmarkRecipe', this.name);
    },

    'click .js-remove-bookmark': function(event) {
        event.preventDefault();

        Meteor.call('unbookmarkRecipe', this.name);
    },

    'click .js-show-customs': function(event) {
        event.stopPropagation();
        Template.garage.setTab('custom')
    },

    'click .js-show-feed': function(event) {
        event.stopPropagation();
        Template.garage.setTab('feed')
    },

    'click .js-uncollapse': function() {
        Template.garage.setTab('garage')
    },
    'click .js-add-activity': function() {
        Overlay.open('activityOverlay', this);
    },
    'click .js-add-custom': function() {
        Overlay.open('wheelsOverlay', this);
    },
    'click #follow': function(event) {
    	Meteor.call('followUser', this._id);
        var notification = {
            recipientId : this._id,
            activityType: 'follower',
            objectId: Meteor.userId(),
            objectType: 'garage'
        }
        Meteor.call('createNotification', notification);
    },
    'click #unfollow': function(event) {
    	Meteor.call('unfollowUser', this._id);
        var notification = {
            recipientId : this._id,
            activityType: 'follower',
            objectId: Meteor.userId(),
            objectType: 'garage'
        }
        Meteor.call('removeNotification', notification);
    },
    'click #editAccount' : function(){
        Router.go('/edit-account/' + this._id)
    }
});
