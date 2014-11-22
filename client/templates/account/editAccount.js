Template.editAccount.events({
	'submit': function (event) {
		event.preventDefault();
		var userData = {
			'profile.name': $(event.target).find('#name').val(),
			'profile.bio': $(event.target).find('#bio').val(),
			'profile.website': $(event.target).find('#website').val(),
		}
		Meteor.call('updateUser', userData, function(error,result){
			if(error) console.error(error)
			console.log(result)
		});
	}
});