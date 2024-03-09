'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MovieWriter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MovieWriter.belongsTo(models.Movie, { foreignKey: 'movieId' });
      MovieWriter.belongsTo(models.CrewMember, { foreignKey: 'writerId' });
    }
  }
  MovieWriter.init({
  }, {
    sequelize,
    modelName: 'MovieWriter',
  });
  return MovieWriter;
};