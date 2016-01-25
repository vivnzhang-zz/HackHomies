Meteor.methods({
  'updateProfile':function(myProfile) {
    console.log("server function called");
    if(Profiles.findOne({id: Meteor.userId()})){
      console.log("updating profile");
      Profiles.update({id: Meteor.userId()}, {$set: myProfile});
    }
    else {
      console.log("adding new profile");
      Profiles.insert(myProfile);
    }
  }
});