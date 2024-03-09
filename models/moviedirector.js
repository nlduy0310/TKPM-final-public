'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MovieDirector extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MovieDirector.belongsTo(models.Movie, { foreignKey: 'movieId' });
      MovieDirector.belongsTo(models.CrewMember, { foreignKey: 'directorId' });
    }
  }
  MovieDirector.init({
  }, {
    sequelize,
    modelName: 'MovieDirector',
  });
  return MovieDirector;
};