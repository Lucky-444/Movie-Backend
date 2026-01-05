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
  /**
   *  Create a booking
   */
  app.post(
    "/mba/api/v1/bookings",
    isAuthenticated,
    validateBookingCreation,
    createBookingController
  );

  /**
   * Get all bookings (Admin only)
   * IMPORTANT: This must be BEFORE /:id
   */
  app.get(
    "/mba/api/v1/bookings/all",
    isAuthenticated,
    isAdmin,
    getAllBookingsController
  );

  /**
   * Get bookings of logged-in user
   */
  app.get("/mba/api/v1/bookings", isAuthenticated, getBookingsController);

  /**
   * Update booking (status, etc.)
   */
  app.patch(
    "/mba/api/v1/bookings/:id",
    isAuthenticated,
    canChangeStatus,
    updateBookingController
  );

  /**
   * Get booking by id
   */
  app.get(
    "/mba/api/v1/bookings/:id",
    isAuthenticated,
    getBookingByIdController
  );
};

module.exports = routes;
