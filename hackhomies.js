Profiles = new Mongo.Collection('profiles');
Skills = new Mongo.Collection('skills');

Skills.insert([
  {_id: "java", name: "Java"},
  {_id: "android", name: "android"},
  {_id: "HTML", name: "HTML"}
]);

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
      //console.log("submitted");
      // alert(event.target.skills.value.dropdown('get selected'));
      var myProfile = {
        _id: Meteor.userId(),
        name: event.target.name.value,
        school: event.target.school.value,
        email: event.target.email.value,
        skills: $('.ui.fluid.dropdown').dropdown('get value')
      }

      if(Profiles.findOne({_id: Meteor.userId()}))
        Profiles.update(
          {_id: Meteor.userId()},
          {$set: myProfile}
        );
      else
        Profiles.insert(myProfile);
    }, 

    
  });

  Template.createProfile.helpers({
    data:function(){
      if(Profiles.findOne({_id: Meteor.userId()})){
        return Profiles.findOne({_id: Meteor.userId()});
      } else {
        return {email: Meteor.user().emails[0].address};
      }
    }
  });

  Template.createProfile.onRendered(function(){
    this.$(".ui.fluid.dropdown").dropdown();
    if(Profiles.findOne({_id: Meteor.userId()})){
      this.$(".ui.fluid.dropdown").dropdown('set selected', Profiles.findOne({_id: Meteor.userId()}).skills);
    }
  });
  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

