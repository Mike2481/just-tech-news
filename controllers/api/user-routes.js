const router = require("express").Router();
const { User, Post, Comment, Vote } = require("../../models");

// GET /api/users
router.get("/", (req, res) => {
  // Access our User model and run .findAll() method
  // User.findAll() is the same as sql query SELECT * FROM users;
  User.findAll({
      attributes: { exclude: ['password'] } // added attribute to exclude password on GET It's in an array because 
                                            // if we want to exclude more than one, we can just add more
  })
    // Sequelize is a JavaScript Promise-based library,
    // meaning we get to use .then() with all of the model methods
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET /api/users/1
router.get("/:id", (req, res) => {
  // User.findOne along with passing in the argument of where is like
  // SELECT * FROM users WHERE id = 1
  User.findOne({
      attributes: { exclude: ['password'] }, // Can be chained together
      where: {
      id: req.params.id
    },
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'post_url', 'created_at']
      },
      // include the Comment model here:
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'created_at'],
        include: {
          model: Post,
          attributes: ['title']
        }
      },
      {
        model: Post,
        attributes: ['title'],
        through: Vote,
        as: 'voted_posts'
      }
    ]
  
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
// POST /api/users
router.post("/", (req, res) => {
  // To insert data, we can use Sequelize's .create() method. Pass in key/value pairs
  // where the keys are what we defined in the User model and the values are what we get from req.body

  // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
  User.create({
    username: req.body.username,
    email: req.body.email, // sql equivalent would look like this:
    password: req.body.password, //INSERT INTO users (username, email, password)
    // VALUES("Lernantino", "lernantino@gmail.com", "password1234");
  })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/login', (req, res) => {
// expects {email: 'lernantino@gmail.com', password: 'password1234'}
    User.findOne({
        where: {
            email: req.body.email
        }
        }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' });
            return;
        }

        //res.json({ user: dbUserData });

        // Verify user
        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }
        res.json({ user: dbUserData, message: 'You are now logged in!' });

    });  
});

// PUT /api/users/1
router.put("/:id", (req, res) => {
  // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

  // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
  // This .update() method combines the parameters for creating data and looking up data.
  // We pass in req.body to provide the new data we want to use in the update and
  // req.params.id to indicate where exactly we want that new data to be used.

  // pass in req.body instead to only update what's passed through
  User.update(req.body, {
    individualHooks: true, // This was added in as a requirement to use beforeUpdate hook in User model
    where: {
      id: req.params.id,
      // sql version would be UPDATE users
      // SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234"
      // WHERE id = 1;
    },
  })
    .then((dbUserData) => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// DELETE /api/users/1
router.delete("/:id", (req, res) => {
  //To delete data, use the .destroy() method and provide some type of identifier
  // to indicate where exactly we would like to delete data from the user database table.
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
