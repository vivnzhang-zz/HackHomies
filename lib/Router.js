Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/login', {
    name: 'login',
    template: 'login'
});

Router.route('/browse', {
    name: 'browse',
    template: 'browse'
});

Router.route('/createProfile', {
    name: 'createProfile',
    template: 'createProfile'
});


var mustBeSignedIn = function(pause) {
  if (!(Meteor.user() || Meteor.loggingIn())) {
    Router.go('login');
  } else {
    this.next();
  }
};

var goToDashboard = function(pause) {
  if (Meteor.user()) {
    Router.go('browse');
  } else {
    this.next();
  }
};

Router.onBeforeAction(mustBeSignedIn, {except: ['login']});
Router.onBeforeAction(goToDashboard, {only: ['index']});

// Router.route('/users/:_id', function() {
// 	var _id = this.params._id;
// 	this.render('fullprofile', {
// 		data: function () {
// 			return Profiles.findOne(_id);
// 		}
// 	});
// });
