const observations = require("./observations.js");

module.exports = function(app) {
  app.configure(observations);
};
