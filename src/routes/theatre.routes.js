const { createTheatreController, deleteTheatreController, getTheatreByIdController } = require("../controllers/theatre.controller");
const { validateTheatreCreateRequest } = require("../middlewares/theatre.middleware");

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
};

module.exports = routes;
