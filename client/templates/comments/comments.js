Template.comments.events({
    'click #submitComment': function(event) {
        var text = $('#comment').val();
        var discussion = Router.current().params['_id'];
        Meteor.call('createComment', {
            discussion_id: discussion,
            text: text,
        }, function(error, result) {
            if (error) {
                alert(error.reason);
            } else {
            	Router.go('home')
            }
        });



        // {
        //     _id: ObjectId(...),
        //     discussion_id: ObjectId(...),
        //     slug: '34db',
        //     posted: ISODateTime(...),
        //     author: {
        //         id: ObjectId(...),
        //         name: 'Rick'
        //     },
        //     text: 'This is so bogus ... '
        // }


    }
});
