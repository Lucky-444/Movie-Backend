const Booking = require("../models/booking.model");

const { STATUS } = require("../utils/constants");

const createBookingService = async (data) => {
  try {
    const response = await Booking.create(data);
    return response;
  } catch (error) {
    console.log(error);
    if (error.name == "ValidationError") {
      let err = {};
      Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
      });
      throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
    }
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

module.exports = {
  createBookingService,
  updateBookingService,
};
