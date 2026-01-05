const {
  createBookingController,
  updateBookingController,
} = require("../controllers/booking.controller");
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const {
  validateBookingCreation,
  canChangeStatus,
} = require("../middlewares/booking.middlewares");

const routes = (app) => {
  //create a Booking
  app.post(
    "/mba/api/v1/bookings",
    isAuthenticated,
    validateBookingCreation,
    createBookingController
  );

  //we add authorization middleware later
  //add update booking route
  app.patch(
    "/mba/api/v1/bookings/:id",
    isAuthenticated,
    canChangeStatus,
    updateBookingController
  );
};

module.exports = routes;
