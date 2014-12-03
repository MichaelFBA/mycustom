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

// RecipesController = RouteController.extend({
//     data: function() {
//         return _.values(RecipesData);
//     }
// });

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

// RecipeController = RouteController.extend({
//     onBeforeAction: function() {
//         Meteor.subscribe('recipe', this.params.name);
//         this.next()
//     },
//     data: function() {
//         return RecipesData[this.params.name];
//     }
// });

AdminController = RouteController.extend({
    onBeforeAction: function() {
        Meteor.subscribe('news');
        this.next()
    }
});

// WheelsController = RouteController.extend({
//     onBeforeAction: function() {
//         Meteor.subscribe('wheels');
//         this.next()
//     },
//     data: function() {
//         return Wheels.find().fetch();
//     }
// });

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
    this.route('home', {
        path: '/'
    });
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
});

Router.onBeforeAction('dataNotFound', {
    only: 'recipe'
});
