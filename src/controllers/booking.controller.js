const {
  errorResponseBody,
  successResponseBody,
} = require("../utils/responseBody");
const {
  createBookingService,
  updateBookingService,
  getBookings,
  getAllBookings,
  getBookingByIdService,
} = require("../services/booking.services");
const { STATUS } = require("../utils/constants");
const createBookingController = async (req, res) => {
  // Logic to create a booking
  try {
    // Here you would typically call a service to handle the booking creation
    // For demonstration, we'll just return the received data
    let userId = req.user; // Extract user ID from the authenticated request
    const response = await createBookingService({
      ...req.body,
      userId: req.user,
    });
    console.log("Booking created:", response);
    successResponseBody.data = response;
    successResponseBody.message = "Booking created successfully";
    res.status(STATUS.CREATED).json(successResponseBody);
  } catch (error) {
    console.error(error);

    if (error.err) {
      errorResponseBody.err = error.err;
      return res
        .status(error.code || STATUS.INTERNAL_SERVER_ERROR)
        .json(errorResponseBody);
    }

    errorResponseBody.err = error.message || error;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};

const updateBookingController = async (req, res) => {
  try {
    const response = await updateBookingService(req.params.id, req.body);
    successResponseBody.data = response;
    successResponseBody.message = "Booking updated successfully";
    res.status(STATUS.OK).json(successResponseBody);
  } catch (error) {
    console.error(error);

    if (error.err) {
      errorResponseBody.err = error.err;
      return res
        .status(error.code || STATUS.INTERNAL_SERVER_ERROR)
        .json(errorResponseBody);
    }

    errorResponseBody.err = error.message || error;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};

const getBookingsController = async (req, res) => {
  try {
    const response = await getBookings({ userId: req.user });
    successResponseBody.data = response;
    successResponseBody.message = "Bookings retrieved successfully";
    res.status(STATUS.OK).json(successResponseBody);
  } catch (error) {
    console.error(error);
    if (error.err) {
      errorResponseBody.err = error.err;
      return res
        .status(error.code || STATUS.INTERNAL_SERVER_ERROR)
        .json(errorResponseBody);
    }
    errorResponseBody.err = error.message || error;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};

const getAllBookingsController = async (req, res) => {
  try {
    const response = await getAllBookings();
    successResponseBody.data = response;
    successResponseBody.message = "All bookings retrieved successfully";
    res.status(STATUS.OK).json(successResponseBody);
  } catch (error) {
    console.error(error);
    if (error.err) {
      errorResponseBody.err = error.err;
      return res
        .status(error.code || STATUS.INTERNAL_SERVER_ERROR)
        .json(errorResponseBody);
    }
    errorResponseBody.err = error.message || error;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};

const getBookingByIdController = async (req, res) => {
  try {
    const response = await getBookingByIdService(req.params.id, req.user);
    successResponseBody.data = response;
    successResponseBody.message = "Booking retrieved successfully";
    res.status(STATUS.OK).json(successResponseBody);
  } catch (error) {
    console.error(error);
    if (error.err) {
      errorResponseBody.err = error.err;
      return res
        .status(error.code || STATUS.INTERNAL_SERVER_ERROR)
        .json(errorResponseBody);
    }
    errorResponseBody.err = error.message || error;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};

module.exports = {
  createBookingController,
  updateBookingController,
  getBookingsController,
  getAllBookingsController,
  getBookingByIdController,
};
