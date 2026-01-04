const { createTheatreController, deleteTheatreController, getTheatreByIdController, getAllTheatresController, getAllQueryTheatresController, getAllMoviesInTheatreController, updateTheatreController, updateMoviesController, checkMovieInATheatreController } = require("../controllers/theatre.controller");
const { validateTheatreCreateRequest, validateTheatreUpdateRequest, validateUpdateMoviesRequest } = require("../middlewares/theatre.middleware");

const {isAuthenticated } = require("../middlewares/auth.middlewares");

const routes = (app) => {
  //this routes take express  app object as parameter
  app.post(
    "/mba/api/v1/theatres",
    validateTheatreCreateRequest,
    createTheatreController
  );

  // Delete theatre route
  app.delete("/mba/api/v1/theatres/:id", isAuthenticated, deleteTheatreController);

  // Get theatre by id route
  app.get("/mba/api/v1/theatres/:id",  getTheatreByIdController);

  // Get all theatres route
  app.get("/mba/api/v1/theatres/all", getAllTheatresController);

  // Get all theatres with query params
  app.get("/mba/api/v1/theatres", getAllQueryTheatresController);

  // Update theatre route
  app.put(
    "/mba/api/v1/theatres/:id",
    updateTheatreController
  );

  // Get all movies in a theatre
  app.get("/mba/api/v1/theatres/:id/movies", getAllMoviesInTheatreController);

  // Update movies in a theatre
  app.patch("/mba/api/v1/theatres/:id/movies",validateUpdateMoviesRequest , updateMoviesController);

  // Check if a movie is present in a theatre
  app.get("/mba/api/v1/theatres/:theatreId/movies/:movieId/check", checkMovieInATheatreController);

};

module.exports = routes;
