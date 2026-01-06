const Show = require("../models/show.model");
const Theatre = require("../models/theatre.model");
const { STATUS } = require("../utils/constants");

const createShowService = async (showData) => {
  try {
    const theatre = await Theatre.findById(showData.theatreId);
    if (!theatre) {
      throw {
        err: "Theatre not found",
        code: STATUS.NOT_FOUND,
      };
    }
    if (theatre.movies.indexOf(showData.movieId) === -1) {
      throw {
        err: "Movie not found in the theatre",
        code: STATUS.NOT_FOUND,
      };
    }
    const response = await Show.create(showData);
    return response;
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

const getShowsService = async (data) => {
  try {
    let filter = {};
    if (data.theatreId) {
      filter.theatreId = data.theatreId;
    }

    if (data.movieId) {
      filter.movieId = data.movieId;
    }

    const response = await Show.find(filter).populate("theatreId");
    if (!response) {
      throw {
        err: "No shows found",
        code: STATUS.NOT_FOUND,
      };
    }
    return response;
  } catch (error) {
    throw error;
  }
};

const deleteShowService = async (showId) => {
  try {
    const response = await Show.findByIdAndDelete(showId);
    if (!response) {
      throw {
        err: "Show not found",
        code: STATUS.NOT_FOUND,
      };
    }
    return response;
  } catch (error) {
    throw error;
  }
};

const updateShowService = async (showId, updateData) => {
  try {
    const response = await Show.findByIdAndUpdate(showId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!response) {
      throw {
        err: "Show not found",
        code: STATUS.NOT_FOUND,
      };
    }
    return response;
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
  createShowService,
  getShowsService,
  deleteShowService,
  updateShowService,
};
