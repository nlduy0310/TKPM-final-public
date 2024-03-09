"use strict";

const controller = {};
const passport = require("./passport");
const models = require("../models");
const url = require("url");
const { resolveSoa } = require("dns");

controller.showLogin = (req, res) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("signin", {
    loginMessage: req.flash("loginMessage"),
    reqUrl: req.query.reqUrl,
  });
};

controller.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect(`/users/login?reqUrl=${req.originalUrl}`);
};


controller.login = (req, res, next) => {
  let reqUrl = req.body.reqUrl ? req.body.reqUrl : "/";
  // console.log(keepSignedIn);
  // console.log(reqUrl);
  passport.authenticate("local-login", (error, user) => {
    // console.log(user);
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.redirect(`/users/login?reqUrl=${reqUrl}`);
    }
    req.login(user, (error) => {
      if (error) {
        return next(error);
      }
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
      // console.log(req.session.cookie.maxAge);
      // console.log(reqUrl)
      return res.redirect(reqUrl);
    });
  })(req, res, next);
};

controller.showSignup = (req, res) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("signup", {
    reqUrl: req.query.reqUrl,
    registerMessage: req.flash("registerMessage"),
    registerMessageSuccess: req.flash("registerMessageSuccess"),
  });
};

controller.signup = (req, res, next) => {
  let reqUrl = req.body.reqUrl ? req.body.reqUrl : "/users/profile";
  passport.authenticate("local-register", (error, user) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.redirect(`/users/register?reqUrl=${reqUrl}`);
    }
    req.logIn(user, (error) => {
      if (error) return next(error);
      res.redirect(reqUrl);
    });
  })(req, res, next);
};

controller.logout = (req, res) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/");
  });
};

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

controller.assertUnauth = (req, res, next) => {
  if (req.isAuthenticated())
    return res.redirect('/');
  return next();
}

controller.facebookLogin = (req, res, next) => {
  let reqUrl = req.body.reqUrl ? req.body.reqUrl : "/users/profile";
  passport.authenticate("facebook", { successRedirect: '/users/profile', failureRedirect: '/users/login' }, (error, user) => {
    // console.log(user);
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.redirect(`/users/login?reqUrl=${reqUrl}`);
    }
    req.login(user, (error) => {
      if (error) {
        return next(error);
      }
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
      // console.log(req.session.cookie.maxAge);
      // console.log(reqUrl)
      return res.redirect(reqUrl);
    });
  })(req, res, next);
}

module.exports = controller;