var express = require('express');
var router = express.Router();
const controller = require("../controllers/indexController");

/* GET home page. */

router.use('/movies', require('./moviesRouter'));

router.get('/signin', function (req, res, next) {
  res.render('signin');
});
router.get('/signup', function (req, res, next) {
  res.render('signup');
});

router.get('/', controller.showHomePage);


router.get("/createDB", (req, res) => {
  let models = require("../models");
  models.sequelize.sync().then(() => {
    models.Movie.addSearchVector();
    res.render("error", { message: "Create database successfully!" });
  });
});

router.get("/dropDB", (req, res) => {
  // destroy session
  req.session.destroy();
  // drop db
  let models = require("../models");
  let sequelize = models.sequelize
  sequelize
    .sync() // create the database table for our model(s)
    .then(function () {
      res.render("error", { message: "Drop database successfully!" });
    })
    .then(function () {
      return sequelize.drop() // drop all tables in the db
    });
})
module.exports = router;
