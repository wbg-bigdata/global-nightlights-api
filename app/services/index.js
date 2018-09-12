const positions = require("./positions/positions.service.js");
const observations = require("./observations.js");

module.exports = function(app) {
  app.configure(positions);
  app.configure(observations);
};
