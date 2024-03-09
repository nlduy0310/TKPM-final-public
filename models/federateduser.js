'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FederatedUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FederatedUser.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  FederatedUser.init({
    provider: DataTypes.STRING,
    federatedId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'FederatedUser',
  });
  return FederatedUser;
};