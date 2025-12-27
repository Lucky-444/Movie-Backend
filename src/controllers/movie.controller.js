const {
  createMovieService,
  deleteMovieService,
  getMoviesService,
  getAllMoviesFromService,
  updateMovieService,
  fetchMovies,
} = require("../services/movie.services");
const { STATUS } = require("../others/constants");
const {
  successResponseBody,
  errorResponseBody,
} = require("../utils/responseBody");

const createMovie = async (req, res) => {
  try {
    const movieData = req.body;
    const movie = await createMovieService(movieData); // use service
    return res.status(201).json({
      message: "Movie created successfully",
      data: movie,
      error: null,
      success: true,
    });
  } catch (error) {
    console.log("Error Occurred In CreateMovieController", error);
    return res.status(500).json({
      message: "Error creating movie",
      data: null,
      error: error.message,
      success: false,
    });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    const deletedMovie = await deleteMovieService(movieId); // use service

    if (!deletedMovie) {
      return res.status(404).json({
        message: "Movie not found",
        data: null,
        error: "No movie with the given ID",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Movie deleted successfully",
      data: deletedMovie,
      error: null,
      success: true,
    });
  } catch (error) {
    console.log("Error Occurred In DeleteMovieController", error);
    return res.status(500).json({
      message: "Error deleting movie",
      data: null,
      error: error.message,
      success: false,
    });
  }
};

const getMovies = async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await getMoviesService(movieId); // use service

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
        data: null,
        error: "No movie with the given ID",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Movie fetched successfully",
      data: movie,
      error: null,
      success: true,
    });
  } catch (error) {
    console.log("Error Occurred In GetMoviesController", error);
    return res.status(500).json({
      message: "Error fetching movies",
      data: null,
      error: error.message,
      success: false,
    });
  }
};
const updateMovieController = async (req, res) => {
  try {
    const movieId = req.params.id;
    const updateData = req.body;
    const updatedMovie = await updateMovieService(movieId, updateData);
    if (!updatedMovie) {
      return res.status(404).json({
        message: "Movie not found",
        data: null,
        error: "No movie with the given ID",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Movie updated successfully",
      data: updatedMovie,
      error: null,
      success: true,
    });
  } catch (error) {
    console.log("Error Occurred In UpdateMovieController", error);
    const statusCode = error.code || 500;
    return res.status(statusCode).json({
      message: "Error updating movie",
      data: null,
      error: error.err || error.message,
      success: false,
    });
  }
};

const getQueryMovies = async (req, res) => {
  try {
    const filter = req.query;
    const response = await fetchMovies(filter);

    successResponseBody.data = response;
    successResponseBody.message = "Movies fetched successfully";

    // return res.status(200).json({
    //   success: true,
    //   message: "Movies fetched successfully",
    //   data: response,
    //   err: null,
    // });
    return res.status(200).json(successResponseBody);
  } catch (error) {
    console.log("Error Occurred In getQueryMovies controller", error);
    const statusCode = error.code || 500;
    if (error.err) {
      errorResponseBody.err = error.err;
      return res.status(statusCode).json(errorResponseBody);
    }
    errorResponseBody.data = null;
    errorResponseBody.err = error.err || null;
    errorResponseBody.message = error.message || "Error fetching movies";
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};

module.exports = {
  createMovie,
  deleteMovie,
  getMovies,
  getQueryMovies,
  updateMovieController,
};
