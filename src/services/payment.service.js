const mongoose = require("mongoose");
const Payment = require("../models/payment.model");
const Booking = require("../models/booking.model");
const Show = require("../models/show.model");
const {
  STATUS,
  PAYMENT_STATUS,
  BOOKING_STATUS,
} = require("../utils/constants");

/**
 * createPaymentService
 *
 * This function is responsible for completing a booking payment.
 *
 * Main responsibilities:
 *  1️⃣ Validate booking
 *  2️⃣ Check expiry window (15 mins rule)
 *  3️⃣ Validate amount BEFORE creating payment
 *  4️⃣ Check seat availability again
 *  5️⃣ Create payment record
 *  6️⃣ Mark booking as successful
 *  7️⃣ Deduct seats
 *  8️⃣ Update seat configuration (seat map JSON)
 */
const createPaymentService = async (paymentData) => {
  try {
    /**
     * STEP 1: Load booking using bookingId
     *
     * We need booking to verify:
     *  - totalCost
     *  - seat count
     *  - movie + theatre + show
     */
    const booking = await Booking.findById(paymentData.bookingId);

    // Booking does not exist → cannot continue
    if (!booking) {
      throw { err: "Booking not found", code: STATUS.NOT_FOUND };
    }

    /**
     * STEP 2: Prevent duplicate payment
     *
     * If booking already paid earlier — do NOT allow another payment
     */
    if (booking.status === BOOKING_STATUS.successfull) {
      throw { err: "Booking already paid", code: STATUS.FORBIDDEN };
    }

    /**
     * STEP 3: Expiry check
     *
     * Rule:
     *   If booking created more than 15 minutes ago
     *   → user must not be allowed to pay
     *
     * Why?
     *  - seats must auto-release if user doesn't pay in time
     */
    const minutes = Math.floor((Date.now() - booking.createdAt) / 1000 / 60);

    if (minutes > 15) {
      booking.status = BOOKING_STATUS.expired;
      await booking.save();
      return booking; // stop flow here
    }

    /**
     * STEP 4: Find Show connected to this booking
     *
     * We match:
     *  - showId
     *  - movieId   (for safety)
     *  - theatreId (for safety)
     *
     * This ensures nobody manipulates IDs and books wrong show.
     */
    const show = await Show.findOne({
      _id: paymentData.showId,
      movieId: booking.movieId,
      theatreId: booking.theatreId,
    });

    if (!show) {
      throw { err: "Show not found", code: STATUS.NOT_FOUND };
    }

    /**
     * STEP 5: Validate amount BEFORE creating payment record
     *
     * We DO NOT create payment entry if money is wrong.
     *
     * If payment mismatch:
     *   - cancel booking
     *   - user must re-book
     */
      const payment = await Payment.create({
        booking: booking._id,
        amount: paymentData.amount,
      });

    if (Number(paymentData.amount) !== Number(booking.totalCost)) {
      booking.status = BOOKING_STATUS.cancelled;
      payment.status = PAYMENT_STATUS.cancelled;
      await payment.save();
      await booking.save();
      return booking;
    }

    /**
     * STEP 6: Check seat availability AGAIN
     *
     * Reason:
     *   Between time of booking and payment,
     *   someone else may have booked remaining seats.
     *
     * If not enough → stop payment.
     */
    if (show.noOfSeats < booking.noOfSeats) {
      throw { err: "Seats not available", code: STATUS.BAD_REQUEST };
    }

    /**
     * STEP 7: Create payment entry
     *
     * Since amount + booking was valid → mark as SUCCESS directly.
     *
     * NOTE:
     *   If you integrate Razorpay/Stripe later,
     *   here you'll verify signature and status instead.
     */


    /**
     * STEP 8: Mark booking as SUCCESS
     *
     * From now:
     *   booking is confirmed
     *   seats are officially sold
     */
    console.log(show.noOfSeats);
    payment.status = PAYMENT_STATUS.success; 
    booking.status = BOOKING_STATUS.successfull;

    /**
     * STEP 9: Deduct seats from show
     *
     * Make sure noOfSeats never goes negative.
     */
    show.noOfSeats -= booking.noOfSeats;

    /**
     * STEP 10: Update seat configuration (seat map)
     *
     * seatConfiguration is stored as:
     *   JSON string with single quotes → '{ rows: [...] }'
     *
     * booking.seat is also stored as JSON string.
     *
     * We:
     *   1️⃣ parse both
     *   2️⃣ find booked seats
     *   3️⃣ mark them as status = 2 (booked)
     */
    if (show.seatConfiguration) {
      // convert to valid JSON
      const showSeatConfig = JSON.parse(
        show.seatConfiguration.replaceAll("'", '"')
      );

      const bookedSeats = JSON.parse(booking.seat.replaceAll("'", '"'));

      // Create map to group seats row-wise
      const map = {};

      bookedSeats.forEach((seat) => {
        if (!map[seat.rowNumber]) map[seat.rowNumber] = new Set();
        map[seat.rowNumber].add(seat.seatNumber);
      });

      // Traverse seat rows and mark booked seats
      showSeatConfig.rows.forEach((row) => {
        if (!map[row.number]) return;

        row.seats = row.seats.map((s) => {
          if (map[row.number].has(s.number)) s.status = 2; // 2 = booked
          return s;
        });
      });

      // Convert JSON back to single-quote string format
      show.seatConfiguration = JSON.stringify(showSeatConfig).replaceAll(
        '"',
        "'"
      );
    }

    /**
     * STEP 11: Save everything to DB
     */
    await show.save();
    await booking.save();

    return booking;
  } catch (error) {
    /**
     * STEP 12: Validation error handling
     *
     * Converts Mongoose validation errors to a readable object
     */
    if (error.name === "ValidationError") {
      let err = {};
      for (field in error.errors) {
        err[field] = error.errors[field].message;
      }
      throw { err, code: STATUS.UNPROCESSABLE_ENTITY };
    }

    console.log(error);
    throw error;
  }
};

module.exports = { createPaymentService };

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
