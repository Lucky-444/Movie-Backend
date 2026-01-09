const mongoose = require("mongoose");
const Payment = require("../models/payment.model");
const Booking = require("../models/booking.model");
const Show = require("../models/show.model");
const {
  STATUS,
  PAYMENT_STATUS,
  BOOKING_STATUS,
  USER_ROLE,
} = require("../utils/constants");
const User = require("../models/user.model");

/**
 * createPaymentService
 */
const createPaymentService = async (paymentData) => {
  try {
    // 1️⃣ Load booking
    const booking = await Booking.findById(paymentData.bookingId);

    if (!booking) {
      throw { err: "Booking not found", code: STATUS.NOT_FOUND };
    }

    // 2️⃣ Prevent duplicate payment
    if (booking.status === BOOKING_STATUS.successfull) {
      throw { err: "Booking already paid", code: STATUS.FORBIDDEN };
    }

    // 3️⃣ Expiry check (15 mins)
    const minutes = Math.floor((Date.now() - booking.createdAt) / 1000 / 60);

    if (minutes > 15) {
      booking.status = BOOKING_STATUS.expired;
      await booking.save();
      return booking;
    }

    // 4️⃣ Find show
    const show = await Show.findOne({
      _id: paymentData.showId,
      movieId: booking.movieId,
      theatreId: booking.theatreId,
    });

    if (!show) {
      throw { err: "Show not found", code: STATUS.NOT_FOUND };
    }

    // 5️⃣ Create payment (PENDING by default)
    const payment = await Payment.create({
      booking: booking._id,
      amount: paymentData.amount,
      status: PAYMENT_STATUS.pending,
    });

    // 6️⃣ Validate amount
    if (Number(paymentData.amount) !== Number(booking.totalCost)) {
      payment.status = PAYMENT_STATUS.cancelled;
      booking.status = BOOKING_STATUS.cancelled;

      await payment.save();
      await booking.save();

      return booking;
    }

    // 7️⃣ Seat availability check
    if (show.noOfSeats < booking.noOfSeats) {
      throw { err: "Seats not available", code: STATUS.BAD_REQUEST };
    }

    // 8️⃣ SUCCESS CASE
    payment.status = PAYMENT_STATUS.success;
    booking.status = BOOKING_STATUS.successfull;
    show.noOfSeats -= booking.noOfSeats;

    // 9️⃣ Update seat configuration
    if (show.seatConfiguration && booking.seat) {
      const showSeatConfig = JSON.parse(
        show.seatConfiguration.replaceAll("'", '"')
      );

      const bookedSeats = JSON.parse(booking.seat.replaceAll("'", '"'));

      const map = {};

      bookedSeats.forEach((seat) => {
        if (!map[seat.rowNumber]) map[seat.rowNumber] = new Set();
        map[seat.rowNumber].add(seat.seatNumber);
      });

      showSeatConfig.rows.forEach((row) => {
        if (!map[row.number]) return;

        row.seats = row.seats.map((s) => {
          if (map[row.number].has(s.number)) {
            s.status = 2; // booked
          }
          return s;
        });
      });

      show.seatConfiguration = JSON.stringify(showSeatConfig).replaceAll(
        '"',
        "'"
      );
    }

    // 🔥 SAVE ALL (FIXED)
    await payment.save();
    await booking.save();
    await show.save();

    return booking;
  } catch (error) {
    if (error.name === "ValidationError") {
      let err = {};
      for (let field in error.errors) {
        err[field] = error.errors[field].message;
      }
      throw { err, code: STATUS.UNPROCESSABLE_ENTITY };
    }

    throw error;
  }
};

/**
 * getPaymentById
 */
const getPaymentById = async (id) => {
  const payment = await Payment.findById(id).populate("booking");

  if (!payment) {
    throw { err: "No payment record found", code: STATUS.NOT_FOUND };
  }

  return payment;
};

/**
 * getAllPaymentsService
 */
const getAllPaymentsService = async (userId) => {
  const user = await User.findById(userId);

  let filter = {};
  if (user.userRole !== USER_ROLE.admin) {
    filter.userId = user.id;
  }

  const bookings = await Booking.find(filter, "id");

  const payments = await Payment.find({ booking: { $in: bookings } });
  return payments;
};

module.exports = {
  createPaymentService,
  getPaymentById,
  getAllPaymentsService,
};

/**const mongoose = require("mongoose");
const Payment = require("../models/payment.model");
const Booking = require("../models/booking.model");
const Show = require("../models/show.model");
const { STATUS, PAYMENT_STATUS, BOOKING_STATUS } = require("../utils/constants");

const createPaymentService = async (paymentData) => {
  // Start a MongoDB session (like opening a transaction)
  const session = await mongoose.startSession();

  try {
    // Every DB write now happens inside this transaction
    session.startTransaction();

    // 1️⃣ Load booking inside session
    const booking = await Booking.findById(paymentData.bookingId).session(session);

    if (!booking) {
      throw { err: "Booking not found", code: STATUS.NOT_FOUND };
    }

    if (booking.status === BOOKING_STATUS.successfull) {
      throw { err: "Booking already paid", code: STATUS.FORBIDDEN };
    }

    // 2️⃣ Load show — inside session
    const show = await Show.findById(paymentData.showId).session(session);

    // 3️⃣ Expiry check
    const minutes = Math.floor((Date.now() - booking.createdAt) / 1000 / 60);

    if (minutes > 15) {
      booking.status = BOOKING_STATUS.expired;
      await booking.save({ session });
      await session.commitTransaction();
      return booking;
    }

    // 4️⃣ Create payment record atomically
    const payment = await Payment.create(
      [
        {
          booking: booking._id,
          amount: paymentData.amount,
        },
      ],
      { session }
    );

    // 5️⃣ Validate amount
    if (payment[0].amount !== booking.totalCost) {
      payment[0].status = PAYMENT_STATUS.failed;
      await payment[0].save({ session });

      booking.status = BOOKING_STATUS.cancelled;
      await booking.save({ session });

      // ❗Rollback NOT needed here — we WANT changes
      await session.commitTransaction();
      return booking;
    }

    // 6️⃣ SUCCESS CASE — ALL CHANGES TOGETHER
    payment[0].status = PAYMENT_STATUS.success;
    await payment[0].save({ session });

    booking.status = BOOKING_STATUS.successfull;
    await booking.save({ session });

    if (show) {
      show.noOfSeats -= booking.noOfSeats;

      await show.save({ session });
    }

    // 7️⃣ Only commit at the end
    await session.commitTransaction();
    return booking;
  } catch (error) {
    // ❌ Any error = rollback everything
    await session.abortTransaction();
    console.log("Transaction rolled back:", error);
    throw error;
  } finally {
    // Always end session
    session.endSession();
  }
};

module.exports = { createPaymentService };
 */
