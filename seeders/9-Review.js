"use strict";

function randomScore() {
  var scores = [0, 1, 1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5];
  var idx = Math.floor(Math.random() * scores.length);
  return scores[idx];
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let items = [];
    const models = require("../models");
    const csv = require("csv-parser");
    const fs = require("fs");
    var path = require('path');
    const compliments = [];
    const criticisms = [];

    // Load review
    console.log(__dirname);
    fs.createReadStream(path.join(__dirname, "sample_data/IMDB_Dataset.csv"))
      .pipe(csv())
      .on("data", (data) => {
        if (data.sentiment.toLowerCase() == "positive") {
          compliments.push(data.review);
        } else {
          criticisms.push(data.review);
        }
      })
      .on("end", function () {
        // console.log(all_reviews);
        // console.log("finished");
      })
      .on("error", function (error) {
        console.log(error.message);
      });

    //console.log(compliments);
    //console.log(criticisms);
    const movies = await models.Movie.findAll({});
    const users = await models.User.findAll({});
    const nb_users = users.length;
    const min_reviews = 3;
    const max_reviews = 8;

    for (let i = 0; i < movies.length; i++) {
      const nb_reviews =
        Math.floor(Math.random() * (max_reviews - min_reviews + 1)) +
        min_reviews;
      const reviewed = [];
      let cnt_score = 0;
      let cnt_positive = 0;
      let cnt_negative = 0;
      for (let j = 0; j < nb_reviews; j++) {
        let id_reviewer;
        let score;
        let content;

        do {
          id_reviewer = Math.floor(Math.random() * (nb_users - 1 + 1)) + 1;
        } while (reviewed.includes(id_reviewer));
        reviewed.push(id_reviewer);
        // 1 - 5
        score = randomScore();
        cnt_score += score
        if (score < 3) {
          cnt_negative += 1;
          content = criticisms[Math.floor(Math.random() * ((criticisms.length - 1) - 0 + 1))]
          items.push({
            content,
            score,
            status: -1,
            movieId: i + 1,
            userId: id_reviewer
          })
        }
        else {
          cnt_positive += 1;
          content = compliments[Math.floor(Math.random() * ((compliments.length - 1) - 0 + 1))]
          items.push({
            content,
            score,
            status: 1,
            movieId: i + 1,
            userId: id_reviewer
          })
        }
        //console.log(content);
      }
      movies[i].set({
        score: Math.floor((cnt_score / nb_reviews) * 10) / 10.0,
        positiveRate: Math.round((cnt_positive / (cnt_positive + cnt_negative)) * 100)
      })
      await movies[i].save();
    }

    items.forEach((item) => {
      item.createdAt = Sequelize.literal("NOW()");
      item.updatedAt = Sequelize.literal("NOW()");
    });
    await queryInterface.bulkInsert("Reviews", items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Reviews", null, {});
  },
};
