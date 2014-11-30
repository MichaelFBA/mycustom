Template.search.helpers({
	lastSearch : function(maxResults) {
	if (Session.get("wheelsFilter") == null) {
		return Wheels.find({}, {
			limit: maxResults
		})
	}
	var s = new RegExp('^'+ Session.get("wheelsFilter"), "i");

	return Wheels.find({
		$or: [{
				type: s
			}, 
			{
				make: s
			},
			{
				model: s
			},
			{
				year: s
			},
			{
				description: s
			},
			{
				place: s
			},
			{
				userName: s
			}
		]
	}, {
		limit: maxResults
	})

	}
});

Template.search.events({
	'keyup #search': function(event) {
		var text = $(event.target).val();
		Session.set("wheelsFilter", text);
	}
});
