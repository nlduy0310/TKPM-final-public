'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User, { foreignKey: 'userId' });
      Review.belongsTo(models.Movie, { foreignKey: 'movieId' });
    }
  }
  Review.init({
    content: DataTypes.TEXT,
    score: DataTypes.REAL,
    status: DataTypes.INTEGER // -1: negative, 1: positive, 0: neutral?
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};