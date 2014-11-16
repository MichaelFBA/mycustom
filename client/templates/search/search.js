Template.search.helpers({
	getSearchResults: function () {
		return Activities.find().fetch()
	}
});