const router = require('express').Router();
const userRoutes = require('./user-routes.js');
const postRoutes = require('./post-routes');
const commentRoutes = require('./comment-routes');

//  Remember how in user-routes.js we didn't use the word users in any routes? 
// That's because in this file we take those routes and implement them to another router instance, 
// prefixing them with the path /users at that time.
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);



module.exports = router;