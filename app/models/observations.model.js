const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get("sequelizeClient");
  const observations = sequelizeClient.define(
    "observations",
    {
      positionId: {
        type: DataTypes.STRING
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

      rade9: {
        type: DataTypes.FLOAT
      },
      rad: {
        type: DataTypes.FLOAT
      },
      li: {
        type: DataTypes.FLOAT
      },

      lc_type: {
        type: DataTypes.INTEGER
      },
      total_hh: {
        type: DataTypes.INTEGER
      },
      e_hh: {
        type: DataTypes.INTEGER
      },
      e_rate: {
        type: DataTypes.FLOAT
      },
      month: {
        type: DataTypes.INTEGER
      },
      day: {
        type: DataTypes.INTEGER
      },
      year: {
        type: DataTypes.INTEGER
      },
      scannedAt: {
        type: DataTypes.DATE
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

  observations.associate = function(models) {
    observations.belongsTo(models.observations);
  };

  return observations;
};
