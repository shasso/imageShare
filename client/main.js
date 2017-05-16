/// routing
Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
    this.render('welcome', {
        to: "main"
    });
    //this.render('images');
});

Router.route('/images', function () {
    this.render('navbar', {
        to: "navbar"
    });
    this.render('images', {
        to: "main"
    });
});

Router.route('/image/:_id', function () {
    this.render('navbar', {
        to: "navbar"
    });
    this.render('image', {
        to: "main",
        data: function () {
            return Images.findOne({_id: this.params._id});
        }
    });
});


console.log("running on the client");
/// infini scroll
Session.set("imageLimit", 8);   // limit # of images to load a time; store in Session variable
lastScrollTop = 0;

// scroll events are not supported directly by Meteor; hence the use of jquery
$(window).scroll(function (event) {
    // test if we are near the bottom of the window
    if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
        // console.log(new Date());
        // where are we in the page? 
        var scrollTop = $(this).scrollTop();
        // test if we are going down
        if (scrollTop > lastScrollTop) {
            // yes we are heading down...
            // console.log("going down at the bottom of the page");
            Session.set("imageLimit", Session.get("imageLimit") + 4);
        }

        lastScrollTop = scrollTop;
    }

});

/// accounts config
Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
});

//Template.images.helpers({images:img_data});
// in filter: field value -1 means highest value first
Template.images.helpers({
    images: function () {
        if (Session.get("userFilter")) { // a logged in user set a filter
            return Images.find({ createdBy: Session.get("userFilter") }, { sort: { createdOn: -1, rating: -1 }, limit: Session.get("imageLimit") });
        }
        else {
            return Images.find({}, { sort: { createdOn: -1, rating: -1 }, limit: Session.get("imageLimit") });
        }

    },
    filtering_images: function () {
        if (Session.get("userFilter")) { // a logged in user set a filter
            var user = Meteor.users.findOne({ _id: Session.get("userFilter") });
            return user.username;
        }
        else {
            return false;
        }
    },
    getFilterUser: function () {
        if (Session.get("userFilter")) { // a logged in user set a filter
            return true;
        }
        else {
            return false;
        }
    },
    getUser: function (user_id) {
        var user = Meteor.users.findOne({ _id: user_id });
        if (user) {
            return user.username;
        }
        else {
            return "anonymous";
        }
    }
});
Template.body.helpers({
    username: function () {
        if (Meteor.user()) {
            console.log(Meteor.user().username);
            // return Meteor.user().emails[0].address;
            return Meteor.user().username;
        }
        else return 'anonymous internet user';
    }
});

Template.images.events({
    'click .js-image': function (event) {
        $(event.target).css("width", "50px");
    },
    'click .js-del-image': function (event) {
        var image_id = this._id;
        console.log(image_id);
        $("#" + image_id).hide('slow', function () {
            Images.remove({ "_id": image_id });
        });
    },
    'click .js-rate-image': function (event) {
        // console.log('you clicked a star');
        var rating = $(event.currentTarget).data("userrating");
        console.log(rating)
        var image_id = this.id;
        console.log(image_id);
        Images.update({ _id: image_id },
                      { $set: { rating: rating } }
            );
    },
    'click .js-show-image-form': function (event) {
        $("#image_add_form").modal('show');
    },
    'click .js-set-image-filter': function (event) {
        Session.set("userFilter", this.createdBy);
    },
    'click .js-unset-image-filter': function (event) {
        Session.set("userFilter", undefined);
    },
});

Template.image_add_form.events({
    'submit .js-add-img': function (event) {
        var img_src, img_alt;
        img_src = event.target.img_src.value;
        img_alt = event.target.img_alt.value;
        console.log("src: " + img_src, " alt: " + img_alt);
        //  We just put return false like this at the end of our event code in Meteor 
        // and it will just stop it from doing whatever the browser normally does when they submit a form.
        if (Meteor.user()) {
            Images.insert({
                img_src: img_src,
                img_alt: img_alt,
                createdOn: new Date(),
                createdBy: Meteor.user()._id
            })
        }
        $("#image_add_form").modal('hide'); // dismiss the modal
        return false;
    }

});