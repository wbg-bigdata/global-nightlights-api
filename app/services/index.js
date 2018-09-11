const positions = require('./positions/positions.service.js');

module.exports = function (app) {
  app.configure(positions);
};
