const Theatre = require("../models/theatre.model");
const STATUS = require("../others/constants").STATUS;
const { createTheatreService, deleteTheatreService, getTheatreByIdService, getAllTheatresService, getAllQueryTheatresService } = require("../services/theatre.services");
const {
  successResponseBody,
  errorResponseBody,
} = require("../utils/responseBody");
const { success, failure } = require("../utils/newResponse");


const createTheatreController = async (req, res) => {
  try {
    const theatreData = req.body;

    const response = await createTheatreService(theatreData);

    return res
      .status(201)
      .json(success("Theatre created successfully", response));
  } catch (error) {
    console.log("Error Occurred In CreateTheatreController", error);

    return res
      .status(error.code || STATUS.INTERNAL_SERVER_ERROR)
      .json(failure("Error creating theatre", error.err || error.message));
  }
};

const deleteTheatreController = async (req, res) => {
  try {
    const theatreId = req.params.id;
    const response = await deleteTheatreService(theatreId);

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

module.exports = {
  createTheatreController,
  deleteTheatreController,
  getTheatreByIdController,
  getAllTheatresController,
  getAllQueryTheatresController,
};