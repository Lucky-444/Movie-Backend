const Theatre = require("../models/theatre.model");
const STATUS = require("../others/constants").STATUS;
const { createTheatreService } = require("../services/theatre.services");
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

module.exports = {
  createTheatreController,
};
