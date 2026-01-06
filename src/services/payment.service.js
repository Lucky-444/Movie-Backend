const Payment = require("../models/payment.model");
const Booking = require("../models/booking.model");
const { STATUS } = require("../utils/constants");

const createPaymentService = async (paymentData) => {
  try {
    const booking = await Booking.findById(paymentData.booking);
    
    if (booking.status == BOOKING_STATUS.successfull) {
      throw {
        err: "Booking already done, cannot make a new payment against it",
        code: STATUS.FORBIDDEN,
      };
    }
    if (!booking) {
      throw {
        err: "Booking not found",
        code: STATUS.NOT_FOUND,
      };
    }

    let bookingTime = booking.createdAt;
    let currentTime = Date.now();

    // Check if 15 minutes have passed since booking creation
    let minutes = Math.floor((currentTime - bookingTime) / 1000 / 60);
    if (minutes > 15) {
      // Update booking status to expired
      booking.status = "expired";
      await booking.save();
      return booking;
    }

    const payment = await Payment.create({
      booking: paymentData.bookingId,
      amount: paymentData.amount,
    });

    if (!payment || payment.status == PAYMENT_STATUS.failed) {
      booking.status = STATUS.CANCELLED;
      await booking.save();
      return booking;
    }
    payment.status = PAYMENT_STATUS.success;
    booking.status = BOOKING_STATUS.successfull;
    await payment.save();
    await booking.save();
    return booking;
  } catch (error) {
    if (error.name === "ValidationError") {
      let err = {};
      for (field in error.errors) {
        err[field] = error.errors[field].message;
      }
      throw {
        err,
        code: STATUS.UNPROCESSABLE_ENTITY,
      };
    }
    throw error;
  }
};

module.exports = {
  createPaymentService,
};
