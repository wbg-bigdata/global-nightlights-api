const _ = require("lodash");
const logger = require("../logger");

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isInt(value) {
  var x;
  if (isNaN(value)) {
    return false;
  }
  x = parseFloat(value);
  return (x | 0) === x;
}

module.exports = function() {
  const app = this;

  app.get("/observations", async function(req, res) {
    const sequelize = app.get("sequelizeClient");

    const geojson = {
      type: "FeatureCollection",
      features: []
    };

    const { nearby, limit } = req.query;

    // Validate "nearby" parameter
    if (!nearby) {
      return res.status(400).json({
        message: 'Missing "nearby" parameter.'
      });
    } else {
      const position = nearby.split(",");
      if (
        !position ||
        position.length !== 2 ||
        !isNumeric(position[0]) ||
        !isNumeric(position[1])
      ) {
        return res.status(400).json({
          message:
            'Invalid "nearby" parameter, should be a pair of decimal values separated by comma (x,y).'
        });
      }
    }

    // Validate "nearby" parameter
    if (limit && (!isInt(limit) || parseInt(limit) > 20)) {
      return res.status(400).json({
        message:
          'Invalid "limit" parameter, must be an integer lower or equal to 20.'
      });
    }

    // Get positions
    const nearestPositionsQuery = `
      SELECT id, geometry
      FROM positions
      ORDER BY geometry <-> st_setsrid(st_makepoint(${nearby}),4326)
      LIMIT ${limit || 5};
    `;

    logger.info(`${req.ip} is querying observations nearby ${nearby}.`);

    let positions;
    try {
      const results = await sequelize.query(nearestPositionsQuery);
      positions = results[0];
    } catch (sequelizeError) {
      logger.error(sequelizeError.message);
      if (sequelizeError)
        return res.status(500).json({ message: "Internal error." });
    }

    if (positions.length > 0) {
      // Get positions ids for observations query
      const positionIds = _.map(positions, p => p.id);

      logger.info(`Positions found: ${positionIds}`);

      // Add "data" property
      positions = _.map(positions, p => {
        p.data = [];
        return p;
      });

      // Transform positions array to object
      positions = _.keyBy(positions, p => p.id);

      // Prepare query
      const observationsQuery = `
        SELECT "positionId", rade9, scanned_at
        FROM observations
        WHERE "positionId" = ANY(ARRAY['${positionIds.join("','")}'])
        ORDER BY scanned_at;
      `;

      try {
        // Query observations
        const results = await sequelize.query(observationsQuery);
        const observations = results[0];

        // Add observations to respective position
        observations.forEach(o => {
          if (positions[o.positionId] && positions[o.positionId].data) {
            // Convert string to number
            if (o.rade9) o.rade9 = parseFloat(o.rade9);

            // Push observation to position's data array
            positions[o.positionId].data.push(o);
          }
        });

        // Format positions as GeoJSON features
        _.forEach(positions, p => {
          const feature = {
            type: "Feature",
            geometry: p.geometry
          };

          // Remove duplicated geometry
          delete p.geometry;

          // Remove duplicated field
          p.data = _.map(p.data, d => {
            delete d.positionId;
            return d;
          });

          // Copy properties
          feature.properties = p;

          // Add feature
          geojson.features.push(feature);
        });
      } catch (sequelizeError) {
        logger.error(sequelizeError.message);
        if (sequelizeError)
          return res.status(500).json({ message: "Internal error." });
      }
    }

    return res.json(geojson);
  });
};
