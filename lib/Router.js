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

Router.route('/sign-out', {
  name: 'sign-out',
  onBeforeAction: function () {
    AccountsTemplates.logout();
    Router.go('/');
    //this.next(); //this line causes 'sign-out template not found error
  }
});

// ServiceConfiguration.configurations.upsert(
//   { service: "facebook" },
//   {
//     $set: {
//       clientId: "1292962797",
//       loginStyle: "popup",
//       secret: "75a730b58f5691de5522789070c319bc"
//     }
//   }
// );

// Meteor.loginWithFacebook({}, function(err){
//     if (err) {
//         throw new Meteor.Error("Facebook login failed");
//     }
// });

// ServiceConfiguration.configurations.insert({
//     service: 'facebook',
//     appId: '12345678901234567890',
//     secret: 'secret12345678901234567890'
// });

// Meteor.loginWithFacebook({
//   requestPermissions: ['public_profile']
// }, function (err) {
//   if (err)
//     Session.set('errorMessage', err.reason || 'Unknown error');
// });