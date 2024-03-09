"use strict";
const models = require("../models");
const Op = require("sequelize").Op;
const controller = {};
const url = require("url");

function age(birthdate) {
  const today = new Date();
  const age =
    today.getFullYear() -
    birthdate.getFullYear() -
    (today.getMonth() < birthdate.getMonth() ||
      (today.getMonth() === birthdate.getMonth() &&
        today.getDate() < birthdate.getDate()));
  return age;
}

controller.showProfile = async (req, res) => {
  res.locals.user = req.user;
  const genres = await models.Genre.findAll({});
  const favGenres = await models.Genre.findAll({
    include: [{
      model: models.User,
      attributes: ["id"],
      where: {
        id: req.user.dataValues.id
      }
    }],
    limit: 2
  });
  const favGenreIds = [];
  if (favGenres) {
    favGenres.forEach((genre) => {
      if (favGenreIds.includes(genre.dataValues.id) == false) {
        favGenreIds.push(genre.dataValues.id);
      }
    });
  }
  console.log(favGenreIds);

  if (favGenreIds.length > 0) {
    genres[favGenreIds[0] - 1].selected1 = true;
    if (favGenreIds.length > 1) {
      genres[favGenreIds[1] - 1].selected2 = true;
    }
  }

  console.log(genres);
  res.locals.user.genres = genres;

  let successMessage = req.query.successMessage;
  let failedMessage = req.query.failedMessage;

  return res.render("profile", {
    successMessage,
    failedMessage
  });
};

controller.updateInfo = async (req, res) => {
  const user = req.user;
  const email = req.body.email;
  const user_email = await models.User.findOne({
    attributes: ["id", "email"],
    where: { email },
  });
  if (user_email) {
    if (user_email.dataValues.id != user.dataValues.id) {
      return res.redirect(
        url.format({
          pathname: "/users/profile",
          query: {
            failedMessage: "Email has been used!",
          },
        })
      );
    }
  }
  if (age(new Date(req.body.dob)) < 13) {
    return res.redirect(
      url.format({
        pathname: "/users/profile",
        query: {
          failedMessage: "User must be 13 years old or older!",
        },
      })
    );
  }

  let password = req.body.password;
  if (password == "") {
    password = user.dataValues.password;
  } else {
    let bcrypt = require("bcrypt");
    password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));
  }
  
  await models.User.update(
    {
      displayName: req.body.displayName,
      email,
      dob: new Date(req.body.dob),
      gender: req.body.gender,
      country: req.body.country,
      password,
    },
    { where: { id: user.dataValues.id } }
  );
  // Remove old ones
  await models.FavoriteGenre.destroy({ where: { userId: user.dataValues.id } });
  // Create fav genres
    
  await models.FavoriteGenre.create({
    userId: req.user.dataValues.id,
    genreId: req.body.favGenre1
  });

  if (req.body.favGenre1 != req.body.favGenre2) {
    await models.FavoriteGenre.create({
      userId: req.user.dataValues.id,
      genreId: req.body.favGenre2
    })
  }

  return res.redirect(
    url.format({
      pathname: "/users/profile",
      query: {
        successMessage: "Cập nhật thành công!",
      },
    })
  );
};

function removeURLParameter(url, parameter) {
  //prefer to use l.search if you have a location/link object
  var urlparts = url.split('?');
  if (urlparts.length >= 2) {

    var prefix = encodeURIComponent(parameter) + '=';
    var pars = urlparts[1].split(/[&;]/g);

    //reverse iteration as may be destructive
    for (var i = pars.length; i-- > 0;) {
      //idiom for string.startsWith
      if (pars[i].lastIndexOf(prefix, 0) !== -1) {
        pars.splice(i, 1);
      }
    }

    return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
  }
  return url;
}
module.exports = controller;
