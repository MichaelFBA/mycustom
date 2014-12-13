var TWEETING_KEY = 'shareOverlayTweeting';
var IMAGE_KEY = 'shareOverlayAttachedImage';

Template.activityOverlay.created = function() {
  Session.set(TWEETING_KEY, false);
  Session.set(IMAGE_KEY, null);
}

Template.activityOverlay.helpers({
  attachedImage: function() {
	return Session.get(IMAGE_KEY);
  },
  
  avatar: function() {
	return Meteor.user().services.twitter.profile_image_url_https;
  },
  
  tweeting: function() {
	return Session.get(TWEETING_KEY);
  },

  getWheels: function(){
	return Wheels.find().fetch();
  }
});

Template.activityOverlay.events({
  'click .js-attach-image': function() {
	// MeteorCamera.getPicture({width: 320}, function(error, data) {
	//   if (error)
	// 	alert(error.reason);
	//   else
	// 	Session.set(IMAGE_KEY, data);
	// });
		navigator.camera.getPicture(onSuccess, onFail, { 
			quality: 80,
		    destinationType: Camera.DestinationType.DATA_URL,
		    correctOrientation:true
		    });

		function onSuccess(data) {
		    Session.set(IMAGE_KEY, "data:image/jpeg;base64," + data);
		}

		function onFail(message) {
		    alert('Failed because: ' + message);
		}
  },
  'click .js-camera-roll':function(event){
		navigator.camera.getPicture(onSuccess, onFail, { 
			quality: 80,
			destinationType: Camera.DestinationType.DATA_URL,
		    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
		    correctOrientation:true
			});

		function onSuccess(data) {
		    Session.set(IMAGE_KEY, "data:image/jpeg;base64," + data);
		}

		function onFail(message) {
		    alert('Failed because: ' + message);
		}
  },
  
  'click .js-unattach-image': function() {
	Session.set(IMAGE_KEY, null);
  },

  'change #type': function(event) {
	Session.set("Type", window[$(event.target).val()] );
  },
  
  'change [name=tweeting]': function(event) {
	Session.set(TWEETING_KEY, $(event.target).is(':checked'));
  },
  
  'submit': function(event, template) {
	var self = this;

	event.preventDefault();

	var relatedId = $(event.target).find('#related').val()
	var description = $(event.target).find('#description').val()
	var tweet = Session.get(TWEETING_KEY);
	
	Meteor.call('createActivity', {
	  wheels: relatedId,
	  description: description,
	  image: Session.get(IMAGE_KEY)
	}, tweet, Geolocation.currentLocation(), function(error, result) {
	  if (error) {
		alert(error.reason);
	  } else {
	  	
		notifyActivity(result);

		Template.appBody.addNotification({
		  action: 'View',
		  title: 'New activity added.',
		  callback: function() {
			Router.go('home');
		  }
		});

	  }
	});

	Overlay.close();
  },

   'click #connectFB': function(event){
   		if (!_.has( Meteor.user().services, "facebook") ) {
    		Meteor.connectWith("facebook", {requestPermissions: ['publish_actions']});
		}
   },
   'click #connectTW': function(event){
   		if (!_.has( Meteor.user().services, "twitter") ) {
    		Meteor.connectWith("twitter");
		}
   }
});

function notifyActivity(activityId){
	var followers = Followers.find({userId:Meteor.userId()}).fetch()

	_.each(followers, function(value, key, list){
    
        var notification = {
            recipientId : value.followerId,
            activityType: 'activity',
            objectId: activityId,
            objectType: 'activity'
        }
        Meteor.call('createNotification', notification);
    
    });
}
