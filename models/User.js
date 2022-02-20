const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require('bcrypt');

// create our User model
class User extends Model {}

// define table columns and configuration
User.init(
  {
    // TABLE COLUMN DEFINITIONS GO HERE
    // define an id column
    id: {
      // use the special Sequelize DataTypes object provide what type of data it is
      type: DataTypes.INTEGER,
      // this is the equivalent of sql's 'not null' option
      allowNull: false,
      // instruct that this is the Primary Key
      primaryKey: true,
      // turn on auto increment
      autoIncrement: true
    },
    // define a username column
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // define an email column
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // there cannot be any duplicate email values in this table
      unique: true,
      // if allowNull is set to false, we can run our data through validators before creating the table data
      validate: {
        isEmail: true,
      },
    },
    // define a password column
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // this means the password must be at least four characters long
        len: [4],
      }
    }
  },
  {
      // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))

      // Also known as lifecycle events, hooks are functions that are called before or after calls in Sequelize
      hooks: {
          // set up beforeCreate lifecycle "hook" functionality
                    // This is the .then version 
                        // beforeCreate(userData) {
                        //     return bcrypt.hash(userData.password, 10).then(newUserData => {
                        //     return newUserData
                        //     });
                        // }
                        
            // This is the async/await version
        async beforeCreate(newUserData) {
            newUserData.password = await bcrypt.hash(newUserData.password, 10);
            return newUserData;
        },
                    // The async keyword is used as a prefix to the function that contains the asynchronous function. 
                    // await can be used to prefix the async function, which will then gracefully assign the value from the response 
                    // to the newUserData's password property. The newUserData is then returned to the application with the hashed password.
        
        // set up beforeUpdate lifecycle 'hook' functionality
        async  beforeUpdate(updatedUserData) {
            updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
            return updatedUserData;
        }
      },
      
  

    // pass in our imported sequelize connection (the direct connection to our database) - required at the top
    sequelize,
    // don't automatically create createdAt/updatedAt timestamp fields
    timestamps: false,
    // don't pluralize name of database table
    freezeTableName: true,
    // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
    underscored: true,
    // make it so our model name stays lowercase in the database
    modelName: "user",
  }
);

module.exports = User;
