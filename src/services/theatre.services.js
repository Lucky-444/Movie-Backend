const Theatre = require("../models/theatre.model");
const STATUS = require("../others/constants").STATUS;

const createTheatreService = async (theatreData) => {
  try {
    const theatre = await Theatre.create(theatreData);
    return theatre;
  } catch (error) {
    if (error.name == "ValidationError") {
      let err = {};
      Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
      });
      console.log(err);
      throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
    } else {
      throw error;
    }
  }
};

const deleteTheatreService = async (theatreId) => {
  try {
    const theatre = await Theatre.findByIdAndDelete(theatreId);
    if (!theatre) {
      throw {
        err: `No theatre found with id: ${theatreId}`,
        code: STATUS.NOT_FOUND,
      };
    }

    return theatre;
  } catch (error) {
    if (error.name == "CastError") {
      throw {
        err: `Theatre id: ${theatreId} is not in proper format`,
        code: STATUS.BAD_REQUEST,
      };
    } else
      throw error;
  }
};

const getTheatreByIdService = async (theatreId) => {
  try {
    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
      throw {
        err: `No theatre found with id: ${theatreId}`,
        code: STATUS.NOT_FOUND,
      };
    }
    return theatre;
  } catch (error) {
    if (error.name == "CastError") {
      throw {
        err: `Theatre id: ${theatreId} is not in proper format`,
        code: STATUS.BAD_REQUEST,
      };
    } else
      throw error;
  }
};

module.exports = {
  createTheatreService,
  deleteTheatreService,
  getTheatreByIdService,
};
