Router.route('/profile', function () {
  this.render('profile');
});

Router.route('/teams', function () {
  this.render('teams');
});

Router.route('/browse', {
  template: 'browse'
});

Router.route('/', function() {
  this.render('login');
})
