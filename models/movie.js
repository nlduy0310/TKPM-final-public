'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Movie.belongsToMany(models.CrewMember, { through: 'MovieDirector', foreignKey: 'movieId', otherKey: 'directorId' });
      Movie.belongsToMany(models.CrewMember, { through: 'MovieWriter', foreignKey: 'movieId', otherKey: 'writerId' });
      Movie.belongsToMany(models.CrewMember, { through: 'MovieCast', foreignKey: 'movieId', otherKey: 'castId' });
      Movie.belongsToMany(models.Genre, { through: 'MovieGenre', foreignKey: 'movieId', otherKey: 'genreId' });
      Movie.belongsToMany(models.User, { through: 'Review', foreignKey: 'movieId', otherKey: 'userId' });
    }

    static getSearchFields() {
      return ['title', 'plot'];
    }

    static getSearchVectorName() {
      return 'SearchContent';
    }

    static addSearchVector() {
      var searchFields = Movie.getSearchFields();
      var vectorName = Movie.getSearchVectorName();
      sequelize.query(`ALTER TABLE "${Movie.tableName}" ADD COLUMN "${vectorName}" TSVECTOR`)
        .then(() => {
          return sequelize.query(`UPDATE "${Movie.tableName}" SET "${vectorName}" = to_tsvector('english', '${searchFields.join('\' || \'')}');`).catch(err => console.log(err));
        })
        .then(() => {
          return sequelize.query(`CREATE INDEX movie_search_idx ON "${Movie.tableName}" USING gin("${vectorName}");`).catch(err => console.log(err));
        })
        .then(() => {
          return sequelize.query(`CREATE TRIGGER search_vector_update BEFORE INSERT OR UPDATE ON "${Movie.tableName}" FOR EACH ROW EXECUTE PROCEDURE
                                 tsvector_update_trigger("${vectorName}", 'pg_catalog.english', ${searchFields.join(', ')})`)
        })
        .catch(err => console.log(err));
    }
  }
  Movie.init({
    title: DataTypes.STRING,
    releaseYear: DataTypes.DATE,
    length: DataTypes.STRING,
    posterUrl: DataTypes.STRING,
    trailerUrl: DataTypes.STRING,
    plot: DataTypes.TEXT,
    imdbScore: DataTypes.REAL,
    score: DataTypes.REAL,
    positiveRate: DataTypes.REAL,
    contentRating: DataTypes.STRING(15)
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};