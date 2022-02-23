const Post = require("./Post");
const User = require("./User");
const Vote = require('./Vote');
const Comment = require('./Comment');
// create associations

// A user can make many posts. But a post only belongs to a single user, and never many users.
// By this relationship definition, we know we have a one-to-many relationship.
// This association creates the reference for the id column in the User model to link to the corresponding foreign key pair, which is the user_id in the Post model

// This was when it was one to many
User.hasMany(Post, {
    foreignKey: 'user_id'
});

// We also need to make the reverse association by adding the following statement
// The constraint we impose here is that a post can belong to one user, but not many users.
// Again, we declare the link to the foreign key, which is designated at user_id in the Post model

// This was when it was one to many
Post.belongsTo(User, {
    foreignKey: 'user_id',
});

User.belongsToMany(Post, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'user_id'
});

Post.belongsToMany(User, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'post_id'
});

Vote.belongsTo(User, {
  foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Vote, {
  foreignKey: 'user_id'
});

Post.hasMany(Vote, {
  foreignKey: 'post_id'
});

Comment.belongsTo(User, {
  foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Comment, {
  foreignKey: 'user_id'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id'
});

module.exports = { User, Post, Vote, Comment };
