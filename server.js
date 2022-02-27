const express = require('express');

// makes stylesheet available to client along with app.use(express.static(path.join(__dirname, 'public'))); found below
const path = require('path');
const app = express(); // initialize express

//Since we set up the routes the way we did, we don't have to worry about importing multiple files for different endpoints. 
//The router instance in routes/index.js collected everything for us and packaged them up for server.js to use.
const routes = require('./controllers/');

// we're importing the connection to Sequelize from config/connection.js. Then, at the bottom of the file, 
//we use the sequelize.sync() method to establish the connection to the database. The "sync" part means that 
//this is Sequelize taking the models and connecting them to associated database tables. 
//If it doesn't find a table, it'll create it for you!
const sequelize = require('./config/connection');

// set up Handlebars.js as your app's template engine of choice:
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');






const PORT = process.env.PORT || 3001;

// These are always required when you will POST/PUT
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// used with path to make stylesheet available to client
app.use(express.static(path.join(__dirname, 'public')));
//The express.static() method is a built-in Express.js middleware function that can take all of the contents of a folder and serve them as static assets. 
// This is useful for front-end specific files like images, style sheets, and JavaScript files.

// turn on routes
app.use(routes);

// {force: false} in the .sync() method. This doesn't have to be included, but if it were set to true, 
//it would drop and re-create all of the database tables on startup. This is great for when we make changes to the Sequelize models,
// as the database would need a way to understand that something has changed. 
//We'll have to do that a few times throughout this project, so it's best to keep the {force: false} there for now.

            // turn on connection to db and server
            // sequelize.sync({ force: false }).then(() => {
            //     app.listen(PORT, () => console.log('Now listening'));
            // });

// association changes will not take affect in the User table, because there isn't a way to make changes to the table dynamically. 
// We will need to drop the table and create a new one in order for the associations to take affect. 
// But Sequelize does have a way to dynamically drop the table and create a new one to overwrite existing tables and establish the new associations.

// If we change the value of the force property to true, then the database connection must sync with the model definitions and associations. 
// By forcing the sync method to true, we will make the tables re-create if there are any association changes

// turn on connection to database and server
            // sequelize.sync({ force: true }).then(() => {
            //     app.listen(PORT, () => console.log('Now listening'));
            //   });
  // This definition performs similarly to DROP TABLE IF EXISTS

  // Another way to check if the tables have been dropped is to see if the user table is still populated. 
  // Then we should change this value back to false. Dropping all the tables every time the application restarts is no longer necessary 
  // and in fact will constantly drop all the entries and seed data we enter, which can get very annoying.

//   turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});