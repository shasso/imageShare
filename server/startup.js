console.log("Running startup on the server");
Meteor.startup(function () {
    if (Images.find().count() == 0) {
        for (var i = 1; i < 23; i++) {
            Images.insert(
                {
                    img_src: "img_" + i + ".jpg",
                    img_alt: "image number: " + i
                });
        }
        // count images
        console.log("starup.js: inserted " + Images.find().count() + " images");
    }
});
