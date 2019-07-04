module.exports = function(app) {
  app.configure(require("./countries.js"));
  app.configure(require("./observations.js"));
};
