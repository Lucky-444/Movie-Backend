const { createTheatreController, deleteTheatreController, getTheatreByIdController, getAllTheatresController, getAllQueryTheatresController, getAllMoviesInTheatreController, updateTheatreController } = require("../controllers/theatre.controller");
const { validateTheatreCreateRequest, validateTheatreUpdateRequest } = require("../middlewares/theatre.middleware");

const routes = (app) => {
  //this routes take express  app object as parameter
  app.post(
    "/mba/api/v1/theatres",
    validateTheatreCreateRequest,
    createTheatreController
  );

  // Delete theatre route
  app.delete("/mba/api/v1/theatres/:id", deleteTheatreController);

  // Get theatre by id route
  app.get("/mba/api/v1/theatres/:id", getTheatreByIdController);

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


};

module.exports = routes;
