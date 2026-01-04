const { createTheatreController, deleteTheatreController, getTheatreByIdController, getAllTheatresController, getAllQueryTheatresController, getAllMoviesInTheatreController, updateTheatreController, updateMoviesController, checkMovieInATheatreController } = require("../controllers/theatre.controller");
const { validateTheatreCreateRequest, validateTheatreUpdateRequest, validateUpdateMoviesRequest } = require("../middlewares/theatre.middleware");

const {isAuthenticated, isAdminOrClient } = require("../middlewares/auth.middlewares");

const routes = (app) => {
  //this routes take express  app object as parameter
  app.post(
    "/mba/api/v1/theatres",
    isAuthenticated,
    isAdminOrClient,
    validateTheatreCreateRequest,
    createTheatreController
  );

  // Delete theatre route
  app.delete("/mba/api/v1/theatres/:id", isAuthenticated,isAdminOrClient, deleteTheatreController);

  // Get theatre by id route
  app.get("/mba/api/v1/theatres/:id",  getTheatreByIdController);

  // Get all theatres route
  app.get("/mba/api/v1/theatres/all", getAllTheatresController);

  // Get all theatres with query params
  app.get("/mba/api/v1/theatres", getAllQueryTheatresController);

  // Update theatre route
  app.put(
    "/mba/api/v1/theatres/:id",
    isAuthenticated,
    isAdminOrClient,
    updateTheatreController
  );

  // Get all movies in a theatre
  app.get("/mba/api/v1/theatres/:id/movies", getAllMoviesInTheatreController);

  // Update movies in a theatre
  app.patch("/mba/api/v1/theatres/:id/movies",validateUpdateMoviesRequest ,isAuthenticated,
    isAdminOrClient,  updateMoviesController);

  // Check if a movie is present in a theatre
  app.get("/mba/api/v1/theatres/:theatreId/movies/:movieId/check", checkMovieInATheatreController);

};

module.exports = routes;
// const {
//   createTheatreController,
//   deleteTheatreController,
//   getTheatreByIdController,
//   getAllTheatresController,
//   getAllQueryTheatresController,
//   getAllMoviesInTheatreController,
//   updateTheatreController,
//   updateMoviesController,
//   checkMovieInATheatreController,
// } = require("../controllers/theatre.controller");

// const {
//   validateTheatreCreateRequest,
//   validateTheatreUpdateRequest,
//   validateUpdateMoviesRequest,
// } = require("../middlewares/theatre.middleware");

// const {
//   isAuthenticated,
//   isAdmin,
//   isClient,
//   isAdminOrClient,
// } = require("../middlewares/auth.middlewares");

// const routes = (app) => {
//   /**
//    * CREATE THEATRE
//    * Only ADMIN or CLIENT can create
//    * Must be logged in
//    */
//   app.post(
//     "/mba/api/v1/theatres",
//     isAuthenticated,
//     isAdminOrClient,
//     validateTheatreCreateRequest,
//     createTheatreController
//   );

//   /**
//    * DELETE THEATRE
//    * Only ADMIN or CLIENT can delete
//    * (Client may delete only their own — handled in controller/service ideally)
//    */
//   app.delete(
//     "/mba/api/v1/theatres/:id",
//     isAuthenticated,
//     isAdminOrClient,
//     deleteTheatreController
//   );

//   /**
//    * GET THEATRE BY ID
//    * Public — no login required
//    */
//   app.get("/mba/api/v1/theatres/:id", getTheatreByIdController);

//   /**
//    * GET ALL THEATRES
//    * Public
//    */
//   app.get("/mba/api/v1/theatres/all", getAllTheatresController);

//   /**
//    * GET THEATRES USING QUERY PARAMS
//    * Public
//    */
//   app.get("/mba/api/v1/theatres", getAllQueryTheatresController);

//   /**
//    * UPDATE THEATRE DETAILS
//    * Only ADMIN or CLIENT (owner)
//    */
//   app.put(
//     "/mba/api/v1/theatres/:id",
//     isAuthenticated,
//     isAdminOrClient,
//     validateTheatreUpdateRequest,
//     updateTheatreController
//   );

//   /**
//    * GET ALL MOVIES IN A THEATRE
//    * Public
//    */
//   app.get("/mba/api/v1/theatres/:id/movies", getAllMoviesInTheatreController);

//   /**
//    * UPDATE MOVIES IN A THEATRE
//    * Only ADMIN or CLIENT
//    */
//   app.patch(
//     "/mba/api/v1/theatres/:id/movies",
//     isAuthenticated,
//     isAdminOrClient,
//     validateUpdateMoviesRequest,
//     updateMoviesController
//   );

//   /**
//    * CHECK IF A MOVIE IS PRESENT IN A THEATRE
//    * Public
//    */
//   app.get(
//     "/mba/api/v1/theatres/:theatreId/movies/:movieId/check",
//     checkMovieInATheatreController
//   );
// };

// module.exports = routes;
