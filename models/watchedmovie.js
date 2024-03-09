'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WatchedMovie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WatchedMovie.belongsTo(models.User, { foreignKey: 'userId' });
      WatchedMovie.belongsTo(models.Movie, { foreignKey: 'movieId' });
    }
  }
  WatchedMovie.init({

  }, {
    sequelize,
    modelName: 'WatchedMovie',
  });
  return WatchedMovie;
};