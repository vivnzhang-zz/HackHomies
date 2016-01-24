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

  Template.fullProfile.helpers({
   button: function () {
    var myTeammates = Profiles.findOne({_id: Meteor.userId()}).team;
    if(myTeammates.indexOf(this._id) == -1){
      return 'requestTeam';
    }
    return 'removeTeam';
   }
  });

  Template.createProfile.events({
    'submit': function (event) {
      var myProfile = {
        _id: Meteor.userId(),
        //pic: event.target.pic.value,
        name: event.target.name.value,
        school: event.target.school.value,
        email: event.target.email.value,
        skills: $('.ui.fluid.dropdown').dropdown('get value'),
        team: []
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

  Template.teams.helpers({
    profiles: function () {
      var myTeam = Profiles.findOne({_id: Meteor.userId()}).team;
      var Teammates = [];
      for(var i = 0; i < myTeam.length; i++){
        var person = Profiles.findOne({_id: myTeam[i]});
        Teammates.push(person);
      }
      return Teammates;
    }
  });

  Template.browse.events({
    'submit .addTeammate': function (event) {
      
      //must have already created profile
      var myTeammates = Profiles.findOne({_id: Meteor.userId()}).team;
      var target = event.target.name.value;
      if(myTeammates.indexOf(event.target.name.value) > -1){
        alreadyAdded = true;
      }  
      if(!alreadyAdded) {
        myTeammates.push(target);
      }  
      Profiles.update(
        {_id: Meteor.userId()},
        {$set: {team: myTeammates}}
      );
    }
  });

  Template.removeTeam.events({
    'submit .removeTeammate': function (event) {
      var myTeammates = Profiles.findOne({_id: Meteor.userId()}).team;
      var index = myTeammates.indexOf(event.target.name.value);
      if(index > -1){
        myTeammates.splice(index, 1);
      }
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

