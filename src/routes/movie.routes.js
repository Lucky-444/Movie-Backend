const { createMovie, deleteMovie, getMovies, getAllMovies, updateMovieController } = require("../controllers/movie.controller");
const validateMovie = require("../middlewares/movie.middlewares");

const routes = (app) => {
  //this routes take express  app object as parameter
  app.post("/mba/api/v1/movies",validateMovie , createMovie);
  app.get("/mba/api/v1/movies/:id", getMovies);
  app.delete("/mba/api/v1/movies/:id", deleteMovie);
  app.get("/mba/api/v1/movies", getAllMovies);
  app.put("/mba/api/v1/movies/:id", updateMovieController);
};

module.exports = routes;
