Router.map(function() {
  this.route('index', {path: '/'});
  this.route('login');
  this.route('profile');
  this.route('browse');
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

Router.route('/users/:username', function() {
	var username = this.params.username;
	this.render('fullprofile', {
		data: function () {
			return Profiles.findOne({username: username});
		}
	});
});

Router.route('/', function() {
  this.render('login');
});

