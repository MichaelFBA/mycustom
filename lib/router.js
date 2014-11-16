var feedSubscription;

// Handle for launch screen possibly dismissed from app-body.js
dataReadyHold = null;

// Global subscriptions
if (Meteor.isClient) {
    Meteor.subscribe('news');
    Meteor.subscribe('bookmarkCounts');
    feedSubscription = Meteor.subscribe('feed');
}

Router.configure({
    layoutTemplate: 'appBody',
    notFoundTemplate: 'notFound'
});

if (Meteor.isClient) {
    // Keep showing the launch screen on mobile devices until we have loaded
    // the app's data
    dataReadyHold = LaunchScreen.hold();
}

HomeController = RouteController.extend({
    onBeforeAction: function() {
        if (Meteor.user()){
            Meteor.subscribe('latestActivity', function() {
                dataReadyHold.release();
            });
            Meteor.subscribe('wheels');
        }else{
            Overlay.open('authOverlay');
        }
	}

});

SearchController = RouteController.extend({
    onBeforeAction: function() {
        Meteor.subscribe('blankSearch');
    },
    data: function() {
        return Activities.find().fetch();
    }
});

RecipesController = RouteController.extend({
    data: function() {
        return _.values(RecipesData);
    }
});

AccountController = RouteController.extend({
    onBeforeAction: function() {
        if (Meteor.user()){
            Meteor.subscribe('getUserData', this.params._id);
            Meteor.subscribe('getUser', this.params._id);
        }else{
            Overlay.open('authOverlay');
        }
    },
    data: function() {
        if (Meteor.user())
            return Meteor.users.findOne({_id: this.params._id});
    }
});

RecipeController = RouteController.extend({
    onBeforeAction: function() {
        Meteor.subscribe('recipe', this.params.name);
    },
    data: function() {
        return RecipesData[this.params.name];
    }
});

AdminController = RouteController.extend({
    onBeforeAction: function() {
        Meteor.subscribe('news');
    }
});

WheelsController = RouteController.extend({
    onBeforeAction: function() {
        Meteor.subscribe('wheels');
    },
    data: function() {
        return Wheels.find().fetch();
    }
});

GetWheelsController = RouteController.extend({
    onBeforeAction: function() {
        Meteor.subscribe('getWheels', this.params._id);
        Meteor.subscribe('getRelatedActivities', this.params._id)
    },
    data: function() {
        return Wheels.findOne();
    }
});

Router.map(function() {
    this.route('home', {
        path: '/'
    });
    this.route('search');
    this.route('account', {
        path: '/account/:_id'
    });
    this.route('wheels');
    this.route('getWheels', {
        path: '/wheels/:_id'
    });
    this.route('about');
    this.route('recipe', {
        path: '/recipes/:name'
    });
    this.route('admin', {
        layoutTemplate: null
    });
});

Router.onBeforeAction('dataNotFound', {
    only: 'recipe'
});
