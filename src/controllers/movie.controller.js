const {
  createMovieService,
  deleteMovieService,
  getMoviesService,
} = require("../services/movie.services");

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

module.exports = {
  createMovie,
  deleteMovie,
  getMovies,
};
