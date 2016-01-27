Profiles = new Mongo.Collection('profiles');

ProfilesIndex = new EasySearch.Index({
  collection: Profiles,
  fields: ['mySkills', 'name', 'school'],
  engine: new EasySearch.MongoDB(),
  defaultSearchOptions: {
    limit: 50
  }
});