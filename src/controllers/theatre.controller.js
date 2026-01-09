const Theatre = require("../models/theatre.model");
const STATUS = require("../others/constants").STATUS;
const {
  createTheatreService,
  deleteTheatreService,
  getTheatreByIdService,
  getAllTheatresService,
  getAllQueryTheatresService,
  getAllMoviesInTheatreService,
  UpdateTheatreService,
  updateMoviesInTheatres,
  checkMovieInATheatre,
} = require("../services/theatre.services");
const {
  successResponseBody,
  errorResponseBody,
} = require("../utils/responseBody");
const { success, failure } = require("../utils/newResponse");


const createTheatreController = async (req, res) => {
  try {
    const theatreData = req.body;

    const response = await createTheatreService({...theatreData , owner : req.user});

    successResponseBody.data = response;
    successResponseBody.message = "Successfully Created the theatre";
    sendMail(
       "Successfully created a theatre",
       req.user,
       "You have successfully created a new theatre"
    );
    return res.status(STATUS.CREATED).json(successResponseBody);
  } catch (error) {
    console.log("Error Occurred In CreateTheatreController", error);

    if (error.err) {
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err = error;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};

const deleteTheatreController = async (req, res) => {
  try {
    const theatreId = req.params.id;
    const response = await deleteTheatreService(theatreId);

    if(!response){
      errorResponseBody.err = `No theatre found with id: ${theatreId}`;
      errorResponseBody.message = "Error deleting in theatre";
      return res.status(404).json(errorResponseBody);
    }

    return res
      .status(200)
      .json(success("Theatre deleted successfully", response));
  } catch (error) {
    console.log("Error Occurred In DeleteTheatreController", error);

    return res
      .status(error.code || STATUS.INTERNAL_SERVER_ERROR)
      .json(failure("Error deleting theatre", error.err || error.message));
  };
};


const getTheatreByIdController = async (req, res) => {
  try {
    const theatreId = req.params.id;
    const response = await getTheatreByIdService(theatreId);

    if(response.err){
      errorResponseBody.err = response.err;
      errorResponseBody.message = "Error fetching theatre";
      return res.status(400).json(errorResponseBody);
    }

    return res
      .status(200)
      .json(success("Theatre fetched successfully", response));
  } catch (error) {
    console.log("Error Occurred In GetTheatreByIdController", error);
    return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(
      failure("Error fetching theatre", error.err || error.message)
    );
  }
};


const getAllTheatresController = async (req, res) => {
  try {
    const response = await getAllTheatresService();
    return res
      .status(200)
      .json(success("Theatres fetched successfully", response));
  } catch (error) {
    console.log("Error Occurred In GetAllTheatresController", error);
    return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(
      failure("Error fetching theatres", error.err || error.message)
    );
  }
};

const getAllQueryTheatresController = async (req, res) => {
  // to be implemented later
  try {
    const response = await getAllQueryTheatresService(req.query);
    return res
      .status(STATUS.OK)
      .json(success("Theatres fetched successfully", response));
  }catch (error) {
    console.log("Error Occurred In GetAllQueryTheatresController", error);
    return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(
      failure("Error fetching theatres", error.err || error.message)
    );
  }
};


const updateTheatreController = async (req, res) => {

  try { 
    const theatreId = req.params.id;
    const theatreData = req.body;
    const response = await UpdateTheatreService(theatreId, theatreData);

    if(response.err){
      errorResponseBody.err = response.err;
      errorResponseBody.message = "Error updating theatre";
      return res.status(400).json(errorResponseBody);
    }

    return res
      .status(200)
      .json(success("Theatre updated successfully", response));
  } catch (error) {
    console.log("Error Occurred In UpdateTheatreController", error);
    return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(
      failure("Error updating theatre", error.err || error.message)
    );
  }
};

const getAllMoviesInTheatreController = async (req, res) => {
  // to be implemented later
  try {
    const theatreId = req.params.id;
    const response = await getAllMoviesInTheatreService(theatreId);

    if(response.err){
      errorResponseBody.err = response.err;
      errorResponseBody.message = "Error fetching movies in theatre";
      return res.status(400).json(errorResponseBody);
    }

    return res
      .status(STATUS.OK)
      .json(success("Movies in theatre fetched successfully", response));
  } catch (error) {
    console.log("Error Occurred In GetAllMoviesInTheatreController", error);
    return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(
      failure("Error fetching movies in theatre", error.err || error.message)
    );
  }
};

const updateMoviesController = async (req, res) => {
  try {
    const response = await updateMoviesInTheatres(
      req.params.id,
      req.body.movieIds,
      req.body.insert
    );
    successResponseBody.data = response;
    successResponseBody.message = "Successfully updated movies in the theatre";
    return res.status(STATUS.OK).json(successResponseBody);
  } catch (error) {
    if (error.err) {
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err = error;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};

const checkMovieInATheatreController = async (req, res) => {
  try {
    const theatreId = req.params.theatreId;
    const movieId = req.params.movieId;
    const response = await checkMovieInATheatre(theatreId, movieId);

    if(response.err){
      return res.status(response.code).json(
        failure("Error checking movie in theatre", response.err)
      );
    }

    sendMail(
      "Successfully created a theatre",
      req.user,
      "You have successfully created a new theatre"
    );

    return res
      .status(STATUS.OK)
      .json(
        success("Successfully checked if movie is present in the theatre", {
          isPresent: response,
        })
      );
  } catch (error) {
    console.log("Error Occurred In CheckMovieInATheatreController", error);
    if(error.err){
      return res.status(error.code).json(
        failure("Error checking movie in theatre", error.err)
      );
    }

    return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(
      failure("Error checking movie in theatre", error.err || error.message)
    );
  }
};
module.exports = {
  createTheatreController,
  deleteTheatreController,
  getTheatreByIdController,
  getAllTheatresController,
  getAllQueryTheatresController,
  updateTheatreController,
  getAllMoviesInTheatreController,
  updateMoviesController,
  checkMovieInATheatreController,
};