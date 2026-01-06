const { createShowController } = require("../controllers/show.controller");
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const { validateCreateShowRequest } = require("../middlewares/show.middlewares");


const routes = (app) => {
         app.post("/mba/api/v1/shows" ,isAuthenticated,validateCreateShowRequest,createShowController);
}
module.exports = routes;