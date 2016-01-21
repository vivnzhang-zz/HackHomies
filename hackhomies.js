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
    'submit': function (event) {
      //console.log("submitted");
      // alert(event.target.skills.value.dropdown('get selected'));
      var myProfile = {
        _id: Meteor.userId(),
        //pic: event.target.pic.value,
        name: event.target.name.value,
        school: event.target.school.value,
        email: event.target.email.value,
        skills: $('.ui.fluid.dropdown').dropdown('get value'),
        //team: []
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

  // Template.teams.helpers({
  //   //var myTeam = Profiles.findOne({_id: Meteor.userId()}).teams;
  //   alert( Profiles.findOne({_id: Meteor.userId()}).teams );
  //   profiles: function () {
  //     return Profiles.find({_id: Profiles.findOne({_id: Meteor.userId()}).teams[0]});
  //   }
  // });

  Template.fullProfile.events({
    'submit .addTeammate': function (event) {
      //alert("button submitted");
      //alert(event.target.skills.value.dropdown('get selected'));
      //alert(event.target.name.value);
      
      //must have already created profile
      var myTeammates = Profiles.findOne({_id: Meteor.userId()}).team;
      myTeammates.push(event.target.name.value)
      Profiles.update(
          {_id: Meteor.userId()},
          {$set: {team: myTeammates}}
        );

    }
    
  });
  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

