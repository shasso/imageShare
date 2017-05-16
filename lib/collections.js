Images = new Mongo.Collection("images");
//console.log(Images.find().count());

// set up security on Images collections
Images.allow({
    insert: function (userId, doc) {
        console.log("testing security on image insert");

        if (Meteor.user()) { // users are logged in 
            // console.log(doc);
            // force the image to be owned by the user
            //doc.createdBy = userId;
            // better yet, dont allow them to add
            if (userId != doc.createdBy) {
                return false;
            }
            else {
                // the user is logged in, the image has the correct user id
                return true;
            }
        }
        else { // user is not logged in
            return false;
        }
        
    },
    remove: function (userId, doc) {
        console.log("testing security on image remove"); // it doesn't work, keep debugging
      
        if (Meteor.user()) {
            return true;
        } else {
            return false;
        }
    }
});

