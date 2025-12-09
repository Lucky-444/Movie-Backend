const { createMovie, deleteMovie, getMovies } = require("../controllers/movie.controller");
const validateMovie = require("../middlewares/movie.middlewares");

const routes = (app) => {
  //this routes take express  app object as parameter
  app.post("/mba/api/v1/movies",validateMovie , createMovie);
  app.get("/mba/api/v1/movies/:id", getMovies);
  app.delete("/mba/api/v1/movies/:id", deleteMovie);
};

module.exports = routes;
