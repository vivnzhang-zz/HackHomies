Profiles = new Mongo.Collection('profiles');
Notifications = new Meteor.Collection('notifications');

if (Meteor.isClient) {

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Template.browse.helpers({
    profiles: function () {
      return Profiles.find({});
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

  Template.requests.helpers({
    sent: function () {
      var mySentRequests = Profiles.findOne({_id: Meteor.userId()}).sentRequests;
      //alert(mySentRequests);
      var Teammates = [];
      for(var i = 0; i < mySentRequests.length; i++){
        var person = Profiles.findOne({_id: mySentRequests[i]});
        Teammates.push(person);
      }
      return Teammates;

      // return Profiles.find({
      //   _id: {$in: mySentRequests}
      // });
    },
    received: function () {
      var myReceivedRequests = Profiles.findOne({_id: Meteor.userId()}).receivedRequests;
      var Teammates = [];
      for(var i = 0; i < myReceivedRequests.length; i++){
        var person = Profiles.findOne({_id: myReceivedRequests[i]});
        Teammates.push(person);
      }
      return Teammates;

    },
    
  });

  Template.fullProfile.helpers({
   button: function () {
    var myProfile = Profiles.findOne({_id: Meteor.userId()});
    var personID = this._id;
    if(myProfile.team.indexOf(this._id) > -1){
      return 'removeTeam';
    } else if(myProfile.receivedRequests.indexOf(this._id) > -1){
      return 'respondRequest';
    } else if(myProfile.sentRequests.indexOf(this._id) > -1){
      return 'deleteRequest';
    } else {
      return 'requestTeam';
    }
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
        team: [],
        sentRequests: [],
        receivedRequests: []
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

  Template.fullProfile.events({
    'submit .requestTeam': function (event) {
      //must have already created profile
      var mySentRequests = Profiles.findOne({_id: Meteor.userId()}).sentRequests;
      //var target = event.target.name.value;
      var target = event.currentTarget.getAttribute('data-id');
      var targetReceivedRequests = Profiles.findOne({_id: target}).receivedRequests;
      mySentRequests.push(target);
      targetReceivedRequests.push(Meteor.userId());
      Profiles.update(
        {_id: Meteor.userId()},
        {$set: {sentRequests: mySentRequests}}
      );
      Profiles.update(
        {_id: target},
        {$set: {receivedRequests: targetReceivedRequests}}
      );
      return false;
    },

    'submit .deleteRequest': function (event) {
      var mySentRequests = Profiles.findOne({_id: Meteor.userId()}).sentRequests;
      var target = event.currentTarget.getAttribute('data-id');
      var index = mySentRequests.indexOf(target);
      var targetReceivedRequests = Profiles.findOne({_id: target}).receivedRequests;
      var targetIndex = targetReceivedRequests.indexOf(Meteor.userId());
      if(index > -1 && targetIndex > -1){
        mySentRequests.splice(target, 1);
        targetReceivedRequests.splice(targetIndex, 1);
      }
      Profiles.update(
        {_id: Meteor.userId()},
        {$set: {sentRequests: mySentRequests}}
      );
      Profiles.update(
        {_id: target},
        {$set: {receivedRequests: targetReceivedRequests}}
      );
      return false;
    },

    'submit .removeTeam': function (event) {
      var myTeammates = Profiles.findOne({_id: Meteor.userId()}).team;
      var target = event.currentTarget.getAttribute('data-id');
      var index = myTeammates.indexOf(target);
      var targetTeammates = Profiles.findOne({_id: target}).team;
      var targetIndex = targetTeammates.indexOf(Meteor.userId());

      if(index > -1 && targetIndex > -1){
        myTeammates.splice(index, 1);
        targetTeammates.splice(targetIndex, 1);
      }

      Profiles.update(
        {_id: Meteor.userId()},
        {$set: {team: myTeammates}}
      );
      Profiles.update(
        {_id: target},
        {$set: {team: targetTeammates}}
      );
      return false;
    },

    'click #accept': function(event, template){
      var myTeammates = Profiles.findOne({_id: Meteor.userId()}).team;
      var target = template.find(".respondRequest").getAttribute('data-id');
      var targetTeammates = Profiles.findOne({_id: Meteor.userId()}).team;
      myTeammates.push(target);
      targetTeammates.push(Meteor.userId());
      Profiles.update(
        {_id: Meteor.userId()},
        {$set: {team: myTeammates}}
      );
      Profiles.update(
        {_id: target},
        {$set: {team: targetTeammates}}
      );

      var myReceivedRequests = Profiles.findOne({_id: Meteor.userId()}).receivedRequests;
      var target = template.find(".respondRequest").getAttribute('data-id');
      var index = myReceivedRequests.indexOf(target);
      var targetSentRequests = Profiles.findOne({_id: target}).sentRequests;
      var targetIndex = targetSentRequests.indexOf(Meteor.userId());
      if(index > -1 && targetIndex > -1){
        myReceivedRequests.splice(index, 1);
        targetSentRequests.splice(targetIndex, 1);
      }
      Profiles.update(
        {_id: Meteor.userId()},
        {$set: {receivedRequests: myReceivedRequests}}
      );
      Profiles.update(
        {_id: target},
        {$set: {sentRequests: mySentRequests}}
      );
      return false;
    },

    'click #decline': function(event, template){
      var myReceivedRequests = Profiles.findOne({_id: Meteor.userId()}).receivedRequests;
      var target = template.find(".respondRequest").getAttribute('data-id');
      var index = myReceivedRequests.indexOf(target);
      var targetSentRequests = Profiles.findOne({_id: target}).sentRequests;
      var targetIndex = targetSentRequests.indexOf(Meteor.userId());
      if(index > -1 && targetIndex > -1){
        myReceivedRequests.splice(index, 1);
        targetSentRequests.splice(targetIndex, 1);
      }
      Profiles.update(
        {_id: Meteor.userId()},
        {$set: {receivedRequests: myReceivedRequests}}
      );
      Profiles.update(
        {_id: target},
        {$set: {sentRequests: mySentRequests}}
      );
      return false;
    }
    
    
  });

  // Template.respondRequest.events({
  //   'click button[type=submit]': function (event, template) {
  //     var myTeammates = Profiles.findOne({_id: Meteor.userId()}).team;
  //     var target = template.find(".respondRequest").getAttribute('data-id');
  //     var targetTeammates = Profiles.findOne({_id: Meteor.userId()}).team;
  //     alert(event.target.prop("id"));
  //     if ($(event.target).prop("id") == "accept") {
  //       myTeammates.push(target);
  //       targetTeammates.push(Meteor.userId());
  //     } 
  //     var myReceivedRequests = Profiles.findOne({_id: Meteor.userId()}).receivedRequests;
  //     var index = myReceivedRequests.indexOf(target);
  //     var targetSentRequests = Profiles.findOne({_id: target}).sentRequests;
  //     var targetIndex = targetSentRequests.indexOf(Meteor.userId());
  //     if(index > -1 && targetIndex > -1){
  //       myReceivedRequests.splice(index, 1);
  //       targetSentRequests.splice(targetIndex, 1);
  //     }
  //     Profiles.update(
  //       {_id: Meteor.userId()},
  //       {$set: {team: myTeammates, receivedRequests: myReceivedRequests}}
  //     );
  //     Profiles.update(
  //       {_id: target},
  //       {$set: {team: targetTeammates, sentRequests: mySentRequests}}
  //     );
  //     return false;
  //   }
    
  // });


  
}

if (Meteor.isServer) {
  Meteor.startup(function(){

  });
}

