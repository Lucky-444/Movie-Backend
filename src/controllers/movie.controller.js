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
    console.log("Error Occcured In CreateMovieController" , error);

    return res.status(500).json({
      message: "Error creating movie",
      data: null,
      error: error.message,
      success: false,
    });
  }
};

module.exports = {
  createMovie,
};
