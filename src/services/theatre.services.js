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
  try{
    let query = {};
    let pagination = {};
    if (data && data.name) {
      // this checks whether name is present in query params or not
      query.name = data.name;
    }
    if(data && data.city){
      // this checks whether city is present in query params or not
      query.city = data.city;
    }
    if (data && data.movieId) {
      query.movies = { $all: data.movieId };
    }

    if(data && data.pincode){
      // this checks whether pincode is present in query params or not
      query.pincode = data.pincode;
    }
    if(data && data.page && data.limit){
      const page = parseInt(data.page);
      const limit = parseInt(data.limit);
      const skip = (page - 1) * limit;
      pagination.skip = skip;
      pagination.limit = limit;
    }

    const theatres = await Theatre.find(query, null, pagination);
    return theatres;
  }catch(error){
    throw error;
  }
}


module.exports = {
  createTheatreService,
  deleteTheatreService,
  getTheatreByIdService,
  getAllTheatresService,
  getAllQueryTheatresService,
};
