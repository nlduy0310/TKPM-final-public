"use strict";

const controller = {};
const models = require("../models");
const sequelize = require("sequelize");
const Op = sequelize.Op;

async function get_popular_movies() {
  let popularMovies = await models.Movie.findAll({
      attributes: ["id", "title", "posterUrl", "score", "positiveRate",
       [sequelize.fn("COUNT", sequelize.col("Users.id")), "numOfReviews"]],
      include: [{
          model: models.User,
          attributes: [],
          through: { attributes: [] },
      }],
      group: ["Movie.id", "Movie.title"], 
      order: [["numOfReviews", "DESC"]],
      // limit: 10,
      raw: true, 
      nested: true,
  });
  return popularMovies.slice(0,10);
}


controller.showHomePage = async (req, res) => {
  let latestMovies = await models.Movie.findAll({
    order: [
      ["releaseYear", "DESC"],
      ["score", "DESC"],
    ],
    limit: 10,
  });

  const popularMovie = await get_popular_movies();
  //console.log(popularMovie);

  let topRatingMovies = await models.Movie.findAll({
    order: [sequelize.literal('"score" IS NOT NULL DESC, "score" DESC')],
    limit: 10,
    raw: true,
  });

  let recommendedMovies;
  if (!req.user) {
    recommendedMovies = await getRecommendation();
  } else {
    const watchedMovies = await models.WatchedMovie.findAll({
      where: { userId: req.user.dataValues.id },
    });
    const favGenres = await models.FavoriteGenre.findAll({
      where: { userId: req.user.dataValues.id },
    });
    const favGenreIds = [];
    const watchedIds = [];
    //console.log(favGenres);
    if (!favGenres || favGenres.length == 0) {
      // Neu ko co thi lay het
      if (favGenreIds.length == 0) {
        //console.log("all")
        const genres = await models.Genre.findAll({});
        genres.forEach((genre) => favGenreIds.push(genre.dataValues.id));
      }
    } else {
      favGenres.forEach((genre) => favGenreIds.push(genre.dataValues.genreId));
    }

    // console.log(watchedMovies)
    watchedMovies.forEach((movie) => watchedIds.push(movie.dataValues.id));

    //console.log(favGenreIds);
    //console.log(watchedIds);
    recommendedMovies = await models.Movie.findAll({
      include: [
        {
          model: models.Genre,
          attributes: ["id"],
          where: {
            id: {
              [Op.in]: favGenreIds,
            },
          },
        },
      ],
      where: {
        id: {
          [Op.notIn]: watchedIds,
        },
      },
      order: [
        ["imdbScore", "DESC"],
        ["releaseYear", "DESC"],
      ],
    });
    //console.log(recommendedMovies);
  }
  let latestReviews = await models.Review.findAll({
    include: [
      {
        model: models.Movie,
        attributes: ["posterUrl", "releaseYear", "title"],
      },
      {
        model: models.User,
        attributes: ["displayName"],
      },
    ],
    order: [["updatedAt", "DESC"]],
    limit: 5,
  });

  latestReviews.forEach((review) => {
    if (review.dataValues.status == 1) {
      review.pos = true;
      review.eval = "Positive";
    } else if (review.dataValues.status == -1) {
      review.eval = "Negative";
    }
  });
  res.locals.newestMovies = await models.Movie.findOne({
    order: [
      ["releaseYear", "DESC"],
      ["imdbScore", "DESC"],
    ],
  });
  res.locals.latestMovies = latestMovies;
  res.locals.popularMovie = popularMovie;
  res.locals.topRatingMovies = topRatingMovies;
  res.locals.recommendedMovies = recommendedMovies;
  res.locals.latestReviews = latestReviews;
  res.locals.user = req.user;
  //console.log(res.locals.user);
  res.render("index");
};

async function getRecommendation(limit) {
  let recommendedMovies = await models.Movie.findAll({
    order: [sequelize.literal("RANDOM()")],
    limit: limit,
    raw: true,
  });
  return recommendedMovies;
}

module.exports = controller;
