var TWEETING_KEY = 'shareOverlayTweeting';
var IMAGE_KEY = 'shareOverlayAttachedImage';

Template.wheelsOverlay.created = function() {
  Session.set(TWEETING_KEY, false);
  Session.set(IMAGE_KEY, null);
  Session.set("Type", Car);
}

Template.wheelsOverlay.helpers({
  attachedImage: function() {
	return Session.get(IMAGE_KEY);
  },
  
  avatar: function() {
	return Meteor.user().services.twitter.profile_image_url_https;
  },
  
  tweeting: function() {
	return Session.get(TWEETING_KEY);
  },

  getType: function(){
	return Type;
  },

  getMake: function(){
	return Session.get("Type");
  }
});

Template.wheelsOverlay.events({
  'click .js-attach-image': function() {
	MeteorCamera.getPicture({width: 320}, function(error, data) {
	  if (error)
		alert(error.reason);
	  else
		Session.set(IMAGE_KEY, data);
	});
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

	var type = $(event.target).find('#type').val()
	var make = $(event.target).find('#make').val()
	var model = $(event.target).find('#model').val()
	var year = $(event.target).find('#year').val()
	var description = $(event.target).find('#description').val()
	var tweet = Session.get(TWEETING_KEY);
	
	Meteor.call('createWheels', {
	  type: type,
	  make: make,
	  model: model,
	  year: year,
	  description: description,
	  image: Session.get(IMAGE_KEY)
	}, tweet, Geolocation.currentLocation(), function(error, result) {
	  if (error) {
		console.log(error);
	  } else {
		Template.appBody.addNotification({
		  action: 'View',
		  title: 'Your custom was added.',
		  callback: function() {
			Template.garage.setTab('custom')
		  }
		});
	  }
	});

	Overlay.close();
  }
});