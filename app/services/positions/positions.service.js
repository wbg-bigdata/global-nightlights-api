// Initializes the `positions` service on path `/positions`
const createService = require('feathers-sequelize');
const createModel = require('../../models/positions.model');
const createObservations = require('../../models/observations.model');
const hooks = require('./positions.hooks');

module.exports = function (app) {

  // As observations does not have a service, just declare the model
  createObservations(app);

  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/positions', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('positions');

  service.hooks(hooks);
};
