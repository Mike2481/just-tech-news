const router = require('express').Router();

// here we are collecting the packaged group of API endpoints and prefixing them with the path /api. 
// Also, note that second use of router.use(). This is so if we make a request to any endpoint that doesn't exist, 
// we'll receive a 404 error indicating we have requested an incorrect resource, another RESTful API practice.

const apiRoutes = require('./api'); // pulls the index file by default which has all others pooled to it

router.use('/api', apiRoutes);

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;