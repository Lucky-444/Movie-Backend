const {
  createPaymentController,
} = require("../controllers/payment.controller");
const { isAuthenticated } = require("../middlewares/auth.middlewares");

const routes = (app) => {
  app.post("/mba/api/v1/payments", isAuthenticated, createPaymentController);
};

module.exports = routes;
