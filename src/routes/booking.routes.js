const {
  createBookingController,
  updateBookingController,
  getBookingByIdController,
  getAllBookingsController,
  getBookingsController,
} = require("../controllers/booking.controller");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middlewares");
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

  //add get booking by id route
  app.get(
    "/mba/api/v1/bookings/:id",
    isAuthenticated,
    getBookingByIdController
  );

  //add get all bookings route
  //this route is only for admin users
  app.get(
    "/mba/api/v1/bookings/all",
    isAuthenticated,
    isAdmin,
    getAllBookingsController
  );

  //add get bookings for a user route
  app.get("/mba/api/v1/bookings", isAuthenticated, getBookingsController);
};

module.exports = routes;
