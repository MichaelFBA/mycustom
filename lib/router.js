var feedSubscription;

// Handle for launch screen possibly dismissed from app-body.js
dataReadyHold = null;

// Global subscriptions
if (Meteor.isClient) {
    Meteor.subscribe('news');
    Meteor.subscribe('likesCounts');
    Meteor.subscribe('commonUserData')
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
        this.next()
	},
    data: function() {
        return Activities.find().fetch();
    }
});

SearchController = RouteController.extend({
    onBeforeAction: function() {
        Meteor.subscribe('blankSearch');
        this.next()
    },
    data: function() {
        return Wheels.find().fetch();
    }
});

GarageController = RouteController.extend({
    onBeforeAction: function() {
        if (Meteor.user()){
            Meteor.subscribe('getUserData', this.params._id);
            Meteor.subscribe('getUser', this.params._id);
        }else{
            Overlay.open('authOverlay');
        }
        this.next()
    },
    data: function() {
        if (Meteor.user())
            return Meteor.users.findOne({_id: this.params._id});
    }
});

GetActivityController = RouteController.extend({
    onBeforeAction: function() {
        console.log('getActivity')
        Meteor.subscribe('getActivity', this.params._id);
        this.next()
    },
    data: function() {
        return Activities.findOne(this.params._id);
    }
});

AdminController = RouteController.extend({
    onBeforeAction: function() {
        Meteor.subscribe('news');
        this.next()
    }
});

GetWheelsController = RouteController.extend({
    onBeforeAction: function() {
        console.log('get wheels')
        Meteor.subscribe('getWheels', this.params._id);
        Meteor.subscribe('getRelatedActivities', this.params._id)
        this.next()
    },
    data: function() {
        return Wheels.findOne();
    }
});

CommentsController = RouteController.extend({
    onBeforeAction: function() {
        Meteor.subscribe('getComments', this.params._id);
        this.next()
    },
    data: function() {
        return Comments.find().fetch();
    }
});

EditAccountController = RouteController.extend({
    onBeforeAction: function() {
        Meteor.subscribe('getUser', this.params._id);
        this.next()
    },
    data: function() {
        return Meteor.users.findOne();
    }
});


Router.map(function() {
    if (Meteor.isCordova) {
        this.route('home', {
            path: '/'
        });
    }else{
        this.route('website-home', {
            path: '/',
            layoutTemplate: null
        });
    }
    
    this.route('comments', {
        path: '/comments/:_id'
    });
    this.route('search');
    this.route('notifications');
    this.route('garage', {
        path: '/garage/:_id'
    });
    this.route('editAccount', {
        path: '/edit-account/:_id'
    });
    this.route('activity', {
        name: 'getActivity',
        path: '/activity/:_id'
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
    //Web
    this.route('terms', {
        path: '/terms',
        layoutTemplate: 'terms'
    });
    this.route('privacy', {
        path: '/privacy',
        layoutTemplate: 'privacy'
    });
});

Router.onBeforeAction('dataNotFound', {
    only: 'recipe'
});

