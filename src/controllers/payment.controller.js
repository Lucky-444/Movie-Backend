const { createPaymentService } = require("../services/payment.service");
const { STATUS, BOOKING_STATUS } = require("../utils/constants");

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

    if (response.status && response.status === BOOKING_STATUS.CANCELLED) {
      errorResponseBody.message = "Payment failed, booking has been cancelled";
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
    errorResponseBody.err = error.message;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};

module.exports = {
  createPaymentController,
};
