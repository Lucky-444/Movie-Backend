const { STATUS } = require("../utils/constants");
const ObjectId = require("mongoose").Types.ObjectId;
const { getTheatreByIdService } = require("../services/theatre.services");
const { errorResponseBody } = require("../utils/responseBody");
const validateBookingCreation = async (req, res, next) => {
  // Check if required fields are present
  if (!req.body.theatreId) {
    errorResponseBody.err = "Theatre ID is required";
    return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
  }

  if (!ObjectId.isValid(req.body.theatreId)) {
    //means if it is not a valid ObjectId of theater id
    errorResponseBody.err = "Invalid Theatre ID format";
    return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
  }
  //Invalid or non-existing theatreId check
  let theatreExists;
  try {
    theatreExists = await getTheatreByIdService(req.body.theatreId);
  } catch (error) {
    errorResponseBody.err = error.err || "Something went wrong";
    return res
      .status(error.code || STATUS.INTERNAL_SERVER_ERROR)
      .json(errorResponseBody);
  }

  if (!req.body.movieId) {
    errorResponseBody.err = "Movie ID is required";
    return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
  }

  if (!ObjectId.isValid(req.body.movieId)) {
    errorResponseBody.err = "Invalid Movie ID format";
    return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
  }
  //includes() → returns true / false
  if (!theatreExists.movies.includes(req.body.movieId)) {
    errorResponseBody.err = "Movie not available in the selected theatre";
    return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
  }

  //for correct checking of objectId use isValid method of mongoose

  if (theatreExists.movies.indexOf(req.body.movieId) == -1) {
    errorResponseBody.err =
      "Given movie is not available in the requested theatre";
    return res.status(STATUS.NOT_FOUND).json(errorResponseBody);
  }
  //validate timing and noOfSeats
  if (!req.body.timing) {
    errorResponseBody.err = "Timing is required";
    return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
  }
  if (!req.body.noOfSeats) {
    errorResponseBody.err = "Number of seats is required";
    return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
  }

  next();
};

module.exports = {
  validateBookingCreation,
};
