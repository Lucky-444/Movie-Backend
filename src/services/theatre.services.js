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
    } else throw error;
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
    } else throw error;
  }
};

const getAllTheatresService = async () => {
  try {
    const theatres = await Theatre.find();
    return theatres;
  } catch (error) {
    throw error;
  }
};

const getAllQueryTheatresService = async (data) => {
  // to be implemented later
  try {
    let query = {};
    let pagination = {};
    if (data && data.name) {
      // this checks whether name is present in query params or not
      query.name = data.name;
    }
    if (data && data.city) {
      // this checks whether city is present in query params or not
      query.city = data.city;
    }
    if (data && data.movieId) {
      // query.movies = data.movieId;

      /**const movieIds = Array.isArray(data.movieId)
    ? data.movieId
    : [data.movieId];

    query.movies = { $in: movieIds }; 
    

    this handles multiple movieIds in query params 
    */

      const movieIds = Array.isArray(data.movieId)
        ? data.movieId
        : [data.movieId];

      query.movies = { $in: movieIds };
    }

    if (data && data.pincode) {
      // this checks whether pincode is present in query params or not
      query.pincode = data.pincode;
    }
    // Check if page and limit exist in the incoming data
    if (data && data.page && data.limit) {
      // Convert page and limit (usually come as strings) into numbers
      const page = parseInt(data.page);
      const limit = parseInt(data.limit);

      // Calculate how many records to skip
      // Example: page = 3, limit = 10  -> skip = 20
      // Means: skip first 20 records, start from record 21
      const skip = (page - 1) * limit;

      // Save values into pagination object
      pagination.skip = skip; // used in DB queries like .skip(skip)
      pagination.limit = limit; // used in DB queries like .limit(limit)
    }

    const theatres = await Theatre.find(query, null, pagination);
    return theatres;
  } catch (error) {
    throw error;
  }
};

const UpdateTheatreService = async (theatreId, data) => {
  try {
    const response = await Theatre.findByIdAndUpdate(theatreId, data, {
      new: true,
      runValidators: true,
    });
    if (!response) {
      // no record found for the given id
      throw {
        err: "No theatre found for the given id",
        code: STATUS.NOT_FOUND,
      };
    }
    return response;
  } catch (error) {
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

const getAllMoviesInTheatreService = async (theatreId) => {
  try {
    const theatre = await Theatre.findById(theatreId, {
      movies: 1,
      names: 1,
      address: 1,
    }).populate("movies");
    //Include only these fields in response
    // name;
    // movies;
    // address;
    if (!theatre) {
      throw {
        err: `No theatre found with id: ${theatreId}`,
        code: STATUS.NOT_FOUND,
      };
    }
    return theatre; // populating movies array with movie details
  } catch (error) {
    if (error.name == "CastError") {
      throw {
        err: `Theatre id: ${theatreId} is not in proper format`,
        code: STATUS.BAD_REQUEST,
      };
    } else throw error;
  }
};

/**
 *
 * @param theatreId -> unique id of the theatre for which we want to update movies
 * @param movieIds -> array of movie ids that are expected to be updated in theatre
 * @param insert -> boolean that tells whether we want insert movies or remove them
 * @returns -> updated theatre object
 */

const updateMoviesInTheatres = async (theatreId, movieIds, insert) => {
  try {
    let theatre;
    if (insert) {
      // we need to add movies
      theatre = await Theatre.findByIdAndUpdate(
        { _id: theatreId },
        { $addToSet: { movies: { $each: movieIds } } },
        { new: true }
      );
    } else {
      // we need to remove movies
      theatre = await Theatre.findByIdAndUpdate(
        { _id: theatreId },
        { $pull: { movies: { $in: movieIds } } },
        { new: true }
      );
    }

    return theatre.populate("movies");
  } catch (error) {
    if (error.name == "TypeError") {
      throw {
        code: STATUS.NOT_FOUND,
        err: "No theatre found for the given id",
      };
    }
    console.log("Error is", error);
    throw error;
  }
};

const getSingleMovieInATheatreService = async (theatreId, movieId) => {
  try {
    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
      throw {
        err: `No theatre found with id: ${theatreId}`,
        code: STATUS.NOT_FOUND,
      };
    }

    const movie = theatre.movies.find(
      (movie) => movie._id.toString() === movieId
    );
    if (!movie) {
      throw {
        err: `No movie found with id: ${movieId} in theatre with id: ${theatreId}`,
        code: STATUS.NOT_FOUND,
      };
    }

    return movie;
  } catch (error) {
    if (error.name == "CastError") {
      throw {
        err: `Theatre id: ${theatreId} is not in proper format`,
        code: STATUS.BAD_REQUEST,
      };
    } else throw error;
  }
};

const checkMovieInATheatre = async (theatreId, movieId) => {
  try {
    let response = await Theatre.findById(theatreId);
    if (!response) {
      throw {
        err: "No such theatre found for the given id",
        code: STATUS.NOT_FOUND,
      };
    }
    return response.movies.indexOf(movieId) != -1;
    //   response.movies.includes(movieId);
    //   How it works
    //   Returns true if the value exists 
    //   Returns false if not
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  createTheatreService,
  deleteTheatreService,
  getTheatreByIdService,
  getAllTheatresService,
  getAllQueryTheatresService,
  UpdateTheatreService,
  getAllMoviesInTheatreService,
  updateMoviesInTheatres,
  getSingleMovieInATheatreService,
  checkMovieInATheatre,
};
