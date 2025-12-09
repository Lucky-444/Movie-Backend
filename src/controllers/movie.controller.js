const Movie = require("../models/movie.model");

const createMovie = async (req, res) => {
  try {
    const movieData = req.body;
    const movie = await Movie.create(movieData);
    return res.status(201).json({
      message: "Movie created successfully",
      data: movie,
      error: null,
      success: true,
    });
  } catch (error) {
    console.log("Error Occcured In CreateMovieController", error);

    return res.status(500).json({
      message: "Error creating movie",
      data: null,
      error: error.message,
      success: false,
    });
  }
};

const deleteMovie = async (req, res) => {
  // To be implemented
  try {
    const movieId = req.params.id;
    const deletedMovie = await Movie.findByIdAndDelete(movieId);

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
  // To be implemented
  try {
    const { id } = req.params;
    const movies = await Movie.findById(id);

    if (!movies) {
      return res.status(404).json({
        message: "Movie not found",
        data: null,
        error: "No movie with the given ID",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Movie fetched successfully",
      data: movies,
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

module.exports = {
  createMovie,
  deleteMovie,
  getMovies,
};
