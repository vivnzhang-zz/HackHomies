Profiles = new Mongo.Collection('profiles');

if (Meteor.isClient) {

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Template.browse.helpers({
    profiles: function () {
      return Profiles.find({});
    }
  });

  // Template.profile.helpers({
  //   username: function () {
  //     return Meteor.user() && Meteor.user().username;
  //   }
  // });

  Template.createProfile.events({
    'submit .profile': function (event) {
      console.log("submitted");
      var myProfile = {
        _id: Meteor.userId(),
        name: event.target.name.value,
        school: event.target.school.value,
        email: event.target.email.value
      };
      Profiles.insert(myProfile);
    }, 

    
  });

  Template.createProfile.helpers({
    data:function(){
      return Profiles.findOne({_id: Meteor.userId()});
    }
  });
  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

