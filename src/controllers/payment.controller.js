const { createPaymentService } = require("../services/payment.service");
const { STATUS, BOOKING_STATUS } = require("../utils/constants");
const { errorResponseBody, successResponseBody } = require("../utils/responseBody");
const {getAllPaymentsService , getPaymentById} = require("../services/payment.service");

const createPaymentController = async (req, res) => {
  try {
    const paymentData = req.body;
    const response = await createPaymentService(paymentData);

    if (response.status && response.status === BOOKING_STATUS.expired) {
      errorResponseBody.message =
        "Booking has expired due to non-payment within 15 minutes please Try again!";
      errorResponseBody.err = "Booking expired";
      return res.status(STATUS.GONE).json(errorResponseBody);
    }

    if (response.status && response.status === BOOKING_STATUS.cancelled) {
      errorResponseBody.message = "Payment Cancelled  booking has been cancelled Please Try Again! pay the correct amount";
      errorResponseBody.err = "Payment failed";
      return res.status(STATUS.PAYMENT_REQUIRED).json(errorResponseBody);
    }

    successResponseBody.message = "Payment processed successfully";
    successResponseBody.data = response;
    return res.status(STATUS.CREATED).json(successResponseBody);
  } catch (error) {
    console.error("Error in createPaymentController:", error);
    if (error.err) {
      errorResponseBody.message = "Failed to process payment";
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.message = "Internal Server Error";
    errorResponseBody.err = error;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};

const getPaymentDetailsById = async (req, res) => {
  try {
    const response = await getPaymentById(req.params.id);
    successResponseBody.data = response;
    successResponseBody.message =
      "Successfully fetched the booking and payment details";
    return res.status(STATUS.OK).json(successResponseBody);
  } catch (error) {
    if (error.err) {
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err = error;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};

const getAllPayments = async (req, res) => {
  try {
    const response = await getAllPaymentsService(req.user);
    successResponseBody.data = response;
    successResponseBody.message = "Successfully fetched all the payments";
    return res.status(STATUS.OK).json(successResponseBody);
  } catch (error) {
    errorResponseBody.err = error;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};

module.exports = {
  createPaymentController,
  getAllPayments,
  getPaymentDetailsById,
};
