const { createShowController, getShowsController, deleteShowController, updateShowController } = require("../controllers/show.controller");
const { isAuthenticated, isAdminOrClient } = require("../middlewares/auth.middlewares");
const {
  validateCreateShowRequest,
  validateShowUpdateRequest,
} = require("../middlewares/show.middlewares");

const routes = (app) => {
  app.post(
    "/mba/api/v1/shows",
    isAuthenticated,
    validateCreateShowRequest,
    createShowController
  );

  //Get allShows using Query Params
  //Unauthenticated User can also access this API
  app.get("/mba/api/v1/shows", getShowsController);

  //Now Delete show, Update show APIs can be added later as per need
  app.delete("/mba/api/v1/shows/:id", isAuthenticated,isAdminOrClient , deleteShowController);

  //Now Update show API
  app.patch(
    "/mba/api/v1/shows/:id",
    isAuthenticated,
    isAdminOrClient,
    validateShowUpdateRequest,
    updateShowController
  );
};

module.exports = routes;
