const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// create our Post model
class Post extends Model {}

// create fields/columns for Post model - In this first parameter for the Post.init function, we define the Post schema
Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    post_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      // Using the references property, we establish the relationship between this post and the user by creating a reference to the User model, 
      // specifically to the id column that is defined by the key property, which is the primary key. 
      // The user_id is conversely defined as the foreign key and will be the matching link.
      references: {
        model: "user",
        key: "id",
      },
    },
  },
  {
// In the second parameter of the init method, we configure the metadata, including the naming conventions.
    // pass in our imported sequelize connection (the direct connection to our database) - required at the top
    sequelize,
    // don't pluralize name of database table
    freezeTableName: true,
    // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
    underscored: true,
    // make it so our model name stays lowercase in the database
    modelName: "post",
  }
);

// Lastly, we must include the export expression to make the Post model accessible to other parts of the application
module.exports = Post;
