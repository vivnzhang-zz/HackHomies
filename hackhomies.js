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

  Template.profile.helpers({
  username: function () {
    return Meteor.user() && Meteor.user().username;
  }
});


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
