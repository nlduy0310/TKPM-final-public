'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CrewMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CrewMember.belongsToMany(models.Movie, { through: 'MovieDirector', foreignKey: 'directorId', otherKey: 'movieId' });
      CrewMember.belongsToMany(models.Movie, { through: 'MovieWriter', foreignKey: 'writerId', otherKey: 'movieId' });
      CrewMember.belongsToMany(models.Movie, { through: 'MovieCast', foreignKey: 'castId', otherKey: 'movieId' });
    }
  }
  CrewMember.init({
    name: DataTypes.STRING,
    imageUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CrewMember',
  });
  return CrewMember;
};