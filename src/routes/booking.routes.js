const {
  createBookingController,
} = require("../controllers/booking.controller");
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const {
  validateBookingCreation,
} = require("../middlewares/booking.middlewares");

const routes = (app) => {
  //create a Booking
  app.post(
    "/mba/api/v1/bookings",
    isAuthenticated,
    validateBookingCreation,
    createBookingController
  );
};

module.exports = routes;
