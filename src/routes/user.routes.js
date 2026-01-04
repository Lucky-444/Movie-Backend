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
};

module.exports = route;
