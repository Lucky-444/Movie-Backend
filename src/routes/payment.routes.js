const {
  createPaymentController,
  getPaymentDetailsById,
  getAllPayments,
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

  
    app.get(
      "/mba/api/v1/payments/:id",
     isAuthenticated,
      getPaymentDetailsById
    );

    app.get(
      "/mba/api/v1/payments",
      isAuthenticated,
      getAllPayments
    );
};

module.exports = routes;
