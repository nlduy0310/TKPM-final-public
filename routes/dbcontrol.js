const express = require('express');
var router = express.Router()
var models = require('../models');

router.get('/', (req, res) => {
    res.render('error', { message: 'dbcontrol' });
})

router.get("/createDB", (req, res) => {
    let models = require("../models");
    models.sequelize.sync().then(() => {
        models.Movie.addSearchVector();
        res.render("error", { message: "Create database successfully!" });
    });
});

router.get("/dropSession", (req, res) => {
    req.session.destroy();
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
            res.render('error', {message: "db dropped"});
            return sequelize.drop() // drop all tables in the db
        });

})

module.exports = router;