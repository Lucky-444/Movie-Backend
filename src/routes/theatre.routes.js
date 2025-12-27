const { createTheatreController } = require("../controllers/theatre.controller");

const routes = (app) => {
  //this routes take express  app object as parameter
  app.post("/mba/api/v1/theatres", createTheatreController);
};

module.exports = routes;
