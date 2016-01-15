Router.route('/profile', function () {
  this.render('profile');
});

Router.route('/teams', function () {
  this.render('teams');
});

Router.route('/browse', {
  template: 'browse'
});

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