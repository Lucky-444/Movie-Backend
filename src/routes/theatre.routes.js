const { createTheatreController } = require("../controllers/theatre.controller");
const { validateTheatreCreateRequest } = require("../middlewares/theatre.middleware");

const routes = (app) => {
  //this routes take express  app object as parameter
  app.post(
    "/mba/api/v1/theatres",
    validateTheatreCreateRequest,
    createTheatreController
  );
};

module.exports = routes;
