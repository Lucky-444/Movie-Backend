const {
  createPaymentController,
} = require("../controllers/payment.controller");
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const {
  verifyPaymentCreateRequest,
} = require("../middlewares/payment.middlewares");

const routes = (app) => {
  app.post(
    "/mba/api/v1/payments",
    isAuthenticated,
    verifyPaymentCreateRequest,
    createPaymentController
  );
};

module.exports = routes;
