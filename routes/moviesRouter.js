const express = require('express');
var router = express.Router();
const controller = require('../controllers/moviesController');

router.get('/', controller.showMovies)

router.post('/review', controller.postReview);

router.get('/:movieId', controller.showMovieDetail)

module.exports = router;