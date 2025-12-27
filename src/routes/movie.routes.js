const { createMovie, deleteMovie, getMovies, updateMovieController, getQueryMovies } = require("../controllers/movie.controller");
const validateMovie = require("../middlewares/movie.middlewares");

const routes = (app) => {
  //this routes take express  app object as parameter
  app.post("/mba/api/v1/movies", validateMovie, createMovie);
  app.get("/mba/api/v1/movies/:id", getMovies);
  app.delete("/mba/api/v1/movies/:id", deleteMovie);
  app.put("/mba/api/v1/movies/:id", validateMovie, updateMovieController);
  
  /** difference between put and patch Update
   * put - updates the entire resource
   * Here is the entire updated object. Replace whatever is stored with this.
   * Treats the resource as completely new.
   * Missing fields are usually overwritten or cleared
   * Not idempotent (sending the same request twice may produce different results)
  *
  * patch - updates only the fields provided in the request
  * Here is a set of changes to apply to the resource.
  * Only the provided fields are updated; others remain unchanged.
  * Missing fields are usually overwritten or cleared
  * Often idempotent (sending the same request twice produces the same result)
  * patch - updates only the fields provided in the request
  *
  */
  
  //new route for fetching movies based on query params
  app.get("/mba/api/v1/movies", getQueryMovies);
};

module.exports = routes;
