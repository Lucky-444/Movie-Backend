const { getShowsController } = require("../controllers/show.controller");
const { update } = require("../controllers/user.controller");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middlewares");
const { validateUpdateUserRequest } = require("../middlewares/user.middlewares");


const route = (app) => {
  app.patch(
    "/mba/api/v1/user/:id",
    isAuthenticated,
    validateUpdateUserRequest,
    isAdmin,
    update
  );

  //Get allShows using Query Params
  //Unauthenticated User can also access this API
  app.get(
    "/mba/api/v1/shows",
    getShowsController
  ); 

  
};

module.exports = route;
