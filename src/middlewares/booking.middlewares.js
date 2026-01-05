const { STATUS } = require("../utils/constants");
const ObjectId = require("mongoose").Types.ObjectId;
const { getTheatreByIdService } = require("../services/theatre.services");
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
  const theatreExists = await getTheatreByIdService(req.body.theatreId);
  if (!theatreExists) {
    errorResponseBody.err = "Theatre with given ID does not exist";
    return res.status(STATUS.NOT_FOUND).json(errorResponseBody);
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
