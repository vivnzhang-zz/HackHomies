Meteor.methods({
  'updateProfile':function(myProfile) {
    console.log("server function called");
    if(Profiles.findOne({_id: Meteor.userId()})){
      console.log("updating profile");
      Profiles.update({_id: Meteor.userId()}, {$set: myProfile});
    }
    else {
      console.log("adding new profile");
      Profiles.insert(myProfile);
    }
  }
});