const { createMovie } = require("../controllers/movie.controller");
const validateMovie = require("../middlewares/movie.middlewares");

const routes = (app) => {
  //this routes take express  app object as parameter
  app.post("/mba/api/v1/movies",validateMovie , createMovie);
};

module.exports = routes;
