const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get("sequelizeClient");
  const positions = sequelizeClient.define(
    "positions",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      dist2010: {
        type: DataTypes.INTEGER
      },
      prp_sets: {
        type: DataTypes.FLOAT
      },
      prp_sets_dist1: {
        type: DataTypes.FLOAT
      },
      prp_sets_dist3: {
        type: DataTypes.FLOAT
      },
      geometry: {
        type: DataTypes.GEOMETRY("POINT", 4326)
      }
    },
    {
      timestamps: false,
      hooks: {
        beforeCount(options) {
          options.raw = true;
        }
      }
    }
  );

  positions.associate = function(models) {
    positions.hasMany(models.observations);
  };

  return positions;
};
