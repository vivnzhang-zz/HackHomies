Profiles = new Mongo.Collection('profiles');

if (Meteor.isClient) {

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Template.body.helpers({
    profiles: function () {
      return Profiles.find({});
    }
  });

  // Template.profile.helpers({
  //   username: function () {
  //     return Meteor.user() && Meteor.user().username;
  //   }
  // });

  Template.body.events({
    'submit .profile': function (event) {
      Profiles.insert({
        name: event.target.name.value,
        school: event.target.school.value,
        email: event.target.email.value
      })
    }
  });


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

