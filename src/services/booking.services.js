const Booking = require("../models/booking.model");
const Show = require("../models/show.model");

const { STATUS } = require("../utils/constants");

// const createBookingService = async (data) => {
//   try {
//     const show = await Show.findOne({
//       movieId: data.movieId,
//       theatreId: data.theatreId,
//       _id: data.showId,
//     });
//     console.log(data);
//     console.log(show.price, data.noOfSeats);
//     if(show.noOfSeats < data.noOfSeats){
//       throw{
//         err : "No.Of seats are less" , 
//         code : STATUS.BAD_REQUEST,
//       }
//     }
//     data.totalCost = data.noOfSeats * show.price;
//     const response = await Booking.create(data);
//     await show.save();
//     return response.populate("movieId theatreId");
//   } catch (error) {
//     console.log(error);
//     if (error.name == "ValidationError") {
//       let err = {};
//       Object.keys(error.errors).forEach((key) => {
//         err[key] = error.errors[key].message;
//       });
//       throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
//     }
//     throw error;
//   }
// };

const createBookingService = async (data) => {
  try {
    /**
     * STEP 1: Find the show user is booking for
     *
     * We match by:
     *  - movieId
     *  - theatreId
     *  - showId
     *
     * This ensures:
     *  - someone can't book a movie in a wrong theatre
     *  - someone can't pass a random showId
     */
    const show = await Show.findOne({
      movieId: data.movieId,
      theatreId: data.theatreId,
      _id: data.showId,
    });

    console.log(data);
    console.log(show.price, data.noOfSeats);

    /**
     * STEP 2: Check seat availability
     *
     * If user tries to book more seats than available,
     * stop immediately and return error
     */
    if (show.noOfSeats < data.noOfSeats) {
      throw {
        err: "No.Of seats are less",
        code: STATUS.BAD_REQUEST,
      };
    }

    /**
     * STEP 3: Calculate total booking cost
     *
     * totalCost = price per ticket * number of seats
     * We attach this to booking data before saving.
     */
    data.totalCost = data.noOfSeats * show.price;

    /**
     * STEP 4: Create booking document in DB
     *
     * At this stage:
     * - booking is CREATED
     * - but seats are NOT yet reduced
     *   (seats will actually be reduced only after successful payment)
     */
    const response = await Booking.create(data);

    /**
     * STEP 5: Save show (Not actually changing anything here,
     * but kept because in future logic you may modify show values)
     */
    await show.save();

    /**
     * STEP 6: Populate references for cleaner response
     *
     * Adds movie + theatre data in the response
     */
    return response.populate("movieId theatreId");
  } catch (error) {
    console.log(error);

    /**
     * STEP 7: Handle validation errors nicely
     *
     * Converts Mongoose validation errors into a cleaner object format
     */
    if (error.name == "ValidationError") {
      let err = {};

      Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
      });

      throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
    }

    // Any other unhandled error — just rethrow
    throw error;
  }
};

const updateBookingService = async (id, data) => {
  try {
    const booking = await Booking.findByIdAndUpdate(id, data, {
      new: true, // return the updated document
      runValidators: true, // to run schema validators on update
    });
    if (!booking) {
      throw {
        err: `No booking found with id: ${id}`,
        code: STATUS.NOT_FOUND,
      };
    }
    return booking;
  } catch (error) {
    console.log(error);
    if (error.name == "ValidationError") {
      let err = {};
      Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
      });
      console.log(err);
      throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
    }
    throw error;
  }
};

const getBookings = async (data) => {
  try {
    const booking = await Booking.find({
      userId: data.userId,
    });
    return booking;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllBookings = async () => {
  try {
    const bookings = await Booking.find({});
    return bookings;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getBookingByIdService = async (id , userId) => {
  try {
    const response = await Booking.findById(id);
    if (!response) {
      throw {
        err: "No booking records found for the id",
        code: STATUS.NOT_FOUND,
      };
    }
    if (response.userId != userId) {
      throw {
        err: "Not able to access the booking",
        code: STATUS.UNAUTHORISED,
      };
    }
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  createBookingService,
  updateBookingService,
         getBookings,
         getAllBookings,
         getBookingByIdService,

};


