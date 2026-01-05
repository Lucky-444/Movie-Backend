const {
  errorResponseBody,
  successResponseBody,
} = require("../utils/responseBody");
const { createBookingService } = require("../services/booking.services");
const { STATUS } = require("../utils/constants");
const createBookingController = async (req, res) => {
  // Logic to create a booking
  try {
   
    // Here you would typically call a service to handle the booking creation
    // For demonstration, we'll just return the received data
    let userId = req.user; // Extract user ID from the authenticated request
    const response = await createBookingService({ ...req.body, userId: req.user });
    console.log("Booking created:", response);
    successResponseBody.data = response;
    successResponseBody.message = "Booking created successfully";
    res.status(STATUS.CREATED).json(successResponseBody);
  } catch (error) {
    console.error(err);
    if (error.err) {
      errorResponseBody.err = error.err;
      return res
        .status(error.code || STATUS.INTERNAL_SERVER_ERROR)
        .json(errorResponseBody);
    }
    errorResponseBody.err = err;
    res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};

module.exports = {
  createBookingController,
};
