const {
  createShowService,
  getShowsService,
  deleteShowService,
  updateShowService,
} = require("../services/show.service");
const { STATUS } = require("../utils/constants");
const {
  errorResponseBody,
  successResponseBody,
} = require("../utils/responseBody");

const createShowController = async (req, res, next) => {
  try {
    const showData = req.body;
    const response = await createShowService(showData);
    successResponseBody.message = "Show created successfully";
    successResponseBody.data = response;
    return res.status(STATUS.CREATED).json(successResponseBody);
  } catch (error) {
    console.error("Error in createShowController:", error);
    if (error.err) {
      errorResponseBody.message = "Failed to create show";
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.message = "Internal Server Error";
    errorResponseBody.err = error.message;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};

const getShowsController = async (req, res, next) => {
  try {
    const filter = req.query;
    const shows = await getShowsService(filter);
    successResponseBody.message = "Shows fetched successfully";
    successResponseBody.data = shows;
    return res.status(STATUS.OK).json(successResponseBody);
  } catch (error) {
    if (error.err) {
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err = error;
    return res.status(STATUS.INTERNAL_SERVER_ERROR);
  }
};

const deleteShowController = async (req, res, next) => {
  // To be implemented
  try {
    const showId = req.params.id;
    const response = await deleteShowService(showId);
    successResponseBody.message = "Show deleted successfully";
    successResponseBody.data = response;
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

const updateShowController = async (req, res, next) => {
  // To be implemented
  try {
    const showId = req.params.id;
    const showData = req.body;
    const response = await updateShowService(showId, showData);
    successResponseBody.message = "Show updated successfully";
    successResponseBody.data = response;
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

module.exports = {
  createShowController,
  getShowsController,
  deleteShowController,
  updateShowController,
};
