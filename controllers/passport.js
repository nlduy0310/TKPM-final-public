"use strict";

const passport = require("passport");
const LocalStrategy = require("passport-local");
const FacebookStrategy = require("passport-facebook");
const bcrypt = require("bcrypt");
const models = require("../models");

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Called by passport.session to get the user's data from DB (based on req.user)
passport.deserializeUser(async (id, done) => {
  try {
    let user = await models.User.findOne({
      attributes: [
        "id",
        "email",
        "displayName",
        "dob",
        "gender",
        "country",
        "password"
      ],
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email", // ten dang nhap la email
      passwordField: "password",
      passReqToCallback: true, // truyen req vao callback de kiem tra user da dang nhap
    },
    async (req, email, password, done) => {
      // console.log(account);
      // console.log(password);

      try {
        // console.log(req.user)
        if (!req.user) {
          console.log(email);
          console.log(password);
          let user = await models.User.findOne({
            where: { email },
          });

          // console.log(user)
          if (!user) {
            // Neu email khong ton tai
            return done(
              null,
              false,
              req.flash("loginMessage", "Your email does not exists!")
            );
          }

          if (!bcrypt.compareSync(password, user.password)) {
            return done(
              null,
              false,
              req.flash("loginMessage", "Your password is incorrect!")
            );
          }
          return done(null, user);
        }
        // bo qua dang nhap
        done(null, req.user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
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

// Dang ki tai khoan
passport.use(
  "local-register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      if (req.user) {
        return done(null, req.user);
      }
      try {
        let user = await models.User.findOne({
          where: { email },
        });


        if (user) {
          return done(
            null,
            false,
            req.flash("registerMessage", "Account had already been created!")
          );
        }


        user = await models.User.create({
          email: req.body.email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(8)),
          displayName: req.body.name
        });

        console.log(user);
        // Thong bao dang ki thanh cong
        done(
          null,
          false,
          req.flash(
            "registerMessageSuccess",
            "Bạn đã đăng ký thành công, hãy đăng nhập."
          )
        );
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(new FacebookStrategy({
  clientID: process.env.FB_APP_ID,
  clientSecret: process.env.FB_APP_SECRET,
  callbackURL: process.env.FB_CALLBACK_URL,
  state: true,
}, async function verify(accessToken, refreshToken, profile, cb) {
  try {
    let row = await models.FederatedUser.findOne({
      where: {
        provider: 'facebook',
        federatedId: profile.id
      },
      raw: true
    })
    if (row) {
      let user = await models.User.findOne({ where: { id: row.userId } })
      if (user)
        return cb(null, user);
      else
        return cb(null, false);
    }
    else {
      const user = await models.User.create({
        email: profile.email,
        displayName: profile.displayName,
      })

      if (user) {
        const fedUser = await models.FederatedUser.create({
          userId: user.id,
          provider: 'facebook',
          federatedId: profile.id
        })

        if (fedUser)
          return cb(null, user);
        else
          return cb(null, false);
      }
      else
        return cb(null, false);
    }
  } catch (error) {
    return cb(error, false);
  }
}))

module.exports = passport;
