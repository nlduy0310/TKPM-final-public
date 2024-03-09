const models = require("../models");
const sequelize = require("sequelize");
const Op = require("sequelize").Op;
const url = require("url");
let controller = {};

async function get_movie_directors(movieId) {
  let movieDirectors = await models.MovieDirector.findAll({
    attributes: ["movieId", "directorId"],
    where: { movieId: movieId },
  });
  let directorIds = movieDirectors.map(
    (movieDirector) => movieDirector.directorId
  );
  let directors = await models.CrewMember.findAll({
    attributes: ["id", "name", "imageUrl"],
    where: {
      id: {
        [sequelize.Op.in]: directorIds,
      },
    },
  });

  return directors;
}

async function get_movie_writers(movieId) {
  let movieWriters = await models.MovieWriter.findAll({
    attributes: ["movieId", "writerId"],
    where: { movieId: movieId },
  });
  let writerIds = movieWriters.map((movieWriter) => movieWriter.writerId);
  let writers = await models.CrewMember.findAll({
    attributes: ["id", "name", "imageUrl"],
    where: {
      id: {
        [sequelize.Op.in]: writerIds,
      },
    },
  });

  return writers;
}

async function get_movie_casts(movieId, starOnly = false) {
  let options = {
    attributes: ["movieId", "castId", "characters"],
    where: { movieId: movieId },
  };
  if (starOnly) options.where.isStar = true;
  let movieCasts = await models.MovieCast.findAll(options);

  movieCasts.forEach(async (movieCast) => {
    let info = await models.CrewMember.findByPk(movieCast.castId);
    movieCast.name = info.name;
    movieCast.imageUrl = info.imageUrl;
  });

  return movieCasts;
}

async function get_popular_movies() {
  let popularMovies = await models.Movie.findAll({
    attributes: [
      "id",
      "title",
      [sequelize.fn("COUNT", sequelize.col("Users.id")), "numOfReviews"],
    ],
    include: [
      {
        model: models.User,
        attributes: [],
        through: { attributes: [] },
      },
    ],
    group: ["Movie.id", "Movie.title"],
    order: [["numOfReviews", "DESC"]],
    // limit: 10,
    raw: true,
    nested: true,
  });
  return popularMovies.slice(0, 10);
}

async function get_toprating_movies() {
  let topRatingMovies = await models.Movie.findAll({
    order: [sequelize.literal('"score" IS NOT NULL DESC, "score" DESC')],
    limit: 10,
    raw: true,
  });
  return topRatingMovies;
}

async function get_topreviewed_movies() {
  let topPositiveReviewMovies = await models.Movie.findAll({
    order: [
      sequelize.literal('"positiveRate" IS NOT NULL DESC, "positiveRate" DESC'),
    ],
    limit: 10,
    raw: true,
  });
  return topPositiveReviewMovies;
}

async function get_reviews(movieId) {
  let latestReviews = await models.Review.findAll({
    include: [
      {
        model: models.Movie,
        where: { id: movieId },
        attributes: ["posterUrl", "releaseYear", "title"],
      },
      {
        model: models.User,
        attributes: ["displayName"],
      },
    ],
    order: [["updatedAt", "DESC"]],
    // limit: 3,
  });
  latestReviews.forEach((review) => {
    if (review.dataValues.status == -1) {
      review.negative = true;
      review.sentiment = "Negative";
    } else {
      review.sentiment = "Positive";
    }
  });
  return latestReviews;
}

async function get_related_movies(movieId) {
  let genres = await models.Genre.findAll({
    include: [
      {
        model: models.Movie,
        where: { id: movieId },
      },
    ],
  });
  let listGenres = genres.map((genre) => genre.id);
  let relatedMovies = await models.Movie.findAll({
    include: [
      {
        model: models.Genre,
        where: { id: { [Op.in]: listGenres } },
        required: false,
        right: true,
      },
    ],
    order: [[sequelize.literal("RANDOM()")]],
  });
  relatedMovies = relatedMovies.filter((movie) => movie.id && movie.Genres);
  return relatedMovies.slice(0, 8);
}

controller.showMovieDetail = async (req, res) => {
  let movieId = req.params.movieId;
  let movieDetails = await models.Movie.findOne({
    where: {
      id: movieId,
    },
    include: [
      {
        model: models.Genre,
        attributes: ["name", "id"],
      },
    ],
  });

  if (movieDetails == null)
    return res.render("error", { message: "Movie does not exist!" });
  if (req.user) {
    await models.WatchedMovie.findOrCreate({
      where: {
        movieId,
        userId: req.user.dataValues.id,
      },
      default: {
        movieId,
        userId: req.user.dataValues.id,
      },
    });
    if (
      await models.Review.findOne({
        where: { movieId, userId: req.user.dataValues.id },
      })
    ) {
      res.locals.commented = true;
    }
  }
  res.locals.movieDetails = movieDetails;

  let directors = await get_movie_directors(movieId);
  res.locals.movieDetails.directors = directors;

  let writers = await get_movie_writers(movieId);
  res.locals.movieDetails.writers = writers;

  let casts = await get_movie_casts(movieId);
  res.locals.movieDetails.casts = casts;
  // console.log(movieDetails)

  let popularMovies = await get_popular_movies();
  res.locals.popularMovies = popularMovies;
  let topRatingMovies = await get_toprating_movies();
  res.locals.topRatingMovies = topRatingMovies;
  let topPositiveReviewMovies = await get_topreviewed_movies();
  res.locals.topPositiveReviewMovies = topPositiveReviewMovies;

  let reviews = await get_reviews(movieId);
  res.locals.reviews = reviews;

  let relatedMovies = await get_related_movies(movieId);
  res.locals.relatedMovies = relatedMovies;

  res.locals.user = req.user;
  res.render("movie");
};

controller.postReview = async (req, res) => {
  if (req.user && req.body.movieId) {
    let userId = req.user.id;
    let movieId = req.body.movieId;
    console.log("userId=" + userId);
    console.log("movieId=" + movieId);
    if (await models.Review.findOne({ where: { movieId, userId } })) {
      res.locals.alertMsg = "You have reviewed this movie before!";
      return res.redirect(`/movies/${movieId}`);
    }
    try {
      let status = await getAnalysis(req.body.review);
      console.log("status=" +status);
      let newReview = await models.Review.create({
        movieId: movieId,
        userId: userId,
        content: req.body.review,
        score: req.body.rating,
        status: status,
      });
      console.log(newReview);
      // Update on Movie
      let reviews = await get_reviews(movieId);
      let sumRating = 0;
      let countPositive = 0;
      for (let i = 0; i < reviews.length; i++) {
        if (reviews[i].status == 1) countPositive += 1;
        sumRating += reviews[i].score;
      }
      let movie = await models.Movie.findOne({ where: { id: movieId } });
      movie.score = Math.floor((sumRating * 10) / reviews.length) / 10;
      movie.positiveRate = Math.ceil((countPositive * 100) / reviews.length);
      await movie.save();
    } catch (error) {
      console.error(error);
    }
    return res.redirect(`/movies/${movieId}`);
  }
};

async function getAnalysis(review) {
  const response = await fetch(
    "https://sentimentanalysis-filmreview-api.onrender.com",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ review: review }),
    }
  );
  const status = await response.json();
  return status["status"] == "Positive" ? 1 : -1;
}

controller.showMovies = async (req, res) => {
  const url = req.originalUrl;
  const genres = await models.Genre.findAll({});
  const reqGenre = req.query.genre ? parseInt(req.query.genre) : 0;
  let type = isNaN(req.query.type) ? parseInt("0") : parseInt(req.query.type);

  let options = {
    attributes: [
      "id",
      "title",
      "releaseYear",
      "length",
      "posterUrl",
      "trailerUrl",
      "plot",
      "imdbScore",
      "positiveRate",
      "contentRating",
      "score",
      "positiveRate",
    ],
    order: [],
    where: {},
    include: [],
  };

  // SEARCH BY KEYWORDS
  let keywords = req.query.keywords || "";
  if (keywords.trim()) {
    options.where.SearchContent = {
      [sequelize.Op.match]: sequelize.fn("plainto_tsquery", keywords),
    };
    options.attributes.push(
      sequelize.literal(
        `ts_rank("SearchContent", plainto_tsquery('english', '${keywords}')) AS "searchScore"`
      )
    );
    options.order.push(sequelize.literal('"searchScore" DESC'));
  }

  // handle search sort
  if (type == 1) {
    res.locals.typeNew = true;
    options.order.push(["releaseYear", "DESC"]);
  } else if (type == 2) {
    options.order.push(["score", "DESC"]);
    res.locals.typeRat = true;
  } else if (type == 3) {
    options.where.positiveRate = {
      [Op.not]: null
    }
    options.order.push(["positiveRate", "DESC"]);
    res.locals.typePos = true;
  } else if (type == 4) {
    options.attributes.push([sequelize.fn("COUNT", sequelize.col("Users.id")), "numOfReviews"]);
    options.include.push({
      model: models.User,
      attributes: [],
      through: { attributes: [] },
    });
    options.group = ["Movie.id", "Movie.title"];
    options.order.push(["numOfReviews", "DESC"]);
    options.raw = true;
    options.nested = true;
    res.locals.typePop = true;
  } else if (type == 5) {
    res.locals.typeImdb = true;
    options.where.imdbScore = {
      [Op.not]: null,
    };
    options.order.push(["imdbScore", "DESC"]);
  } else res.locals.typeAll = true;

  // handle search genre
  genres.forEach((genre) => {
    genre.url = url;
    if (genre.dataValues.id == reqGenre) genre.selected = true;
  });

  // console.log(genres);

  if (reqGenre > 0) {
    options.include.push({
      model: models.Genre,
      where: {
        id: reqGenre,
      },
    });
  } else res.locals.genreAll = true;

  // handle pagination
  const page = isNaN(req.query.page)
    ? 1
    : Math.max(1, parseInt(req.query.page));
  const limit = 8;
  options.offset = limit * (page - 1);
  if (type != 4) {
    options.limit = limit;
  }

  // Find movies
  console.log(options);
  const { rows, count } = await models.Movie.findAndCountAll(options);

  res.locals.pagination = {
    page: page,
    limit: limit,
    totalRows: (type == 4) ? count.length : count,
    queryParams: req.query,
  };

  res.locals.keywords = req.query.keywords;
  res.locals.movies = rows.slice(0, limit);
  res.locals.url = url;
  res.locals.genres = genres;
  res.locals.user = req.user;
  res.render("movies");
};

module.exports = controller;
