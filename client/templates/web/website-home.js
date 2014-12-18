Template.websiteHome.rendered = function () {
	$(document).foundation();
};

Template.websiteHome.events({
	'submit':function(event){
		console.log('submit')
		event.preventDefault()
		var emailAddress = $(event.target).find('input').val()
		Subscriptions.insert({
			email: emailAddress,
			createdAt: moment().format()
		}, function(error, result) {
			if (error) {
				console.error(error)
			} else {
				console.log('added address');
				$('.alert-box').removeClass('hide')
				Meteor.call('sendEmail',
	            emailAddress,
	            'info@my-custom.com',
	            'Welcome to My Custom',
	            'This should send html message');
				}
		})
	}
});