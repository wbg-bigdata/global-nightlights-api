const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const observations = sequelizeClient.define('observations', {
    positionId: {
      type: DataTypes.STRING,
    },
    scannedAt: {
      type: DataTypes.DATE
    },
    readings: {
      type: DataTypes.JSONB
    }
  }, {
    timestamps: false,
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  observations.associate = function (models) {
    observations.belongsTo(models.observations);
  };

  return observations;
};
