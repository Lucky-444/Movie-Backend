const { createMovie } = require("../controllers/movie.controller");

const routes = (app) => {
  //this routes take express  app object as parameter
  app.post("/mba/api/v1/movies", createMovie);
};

module.exports = routes;
