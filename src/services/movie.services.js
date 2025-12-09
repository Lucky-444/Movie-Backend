const Movie = require("../models/movie.model");

const createMovieService = async (movieData) => {
  const movie = await Movie.create(movieData);
  return movie;
}

const deleteMovieService = async (req , res, movieId) => {
  const deletedMovie = await Movie.findByIdAndDelete(movieId);
  return deletedMovie;
}
const getMoviesService = async (movieId) => {
  const movie = await Movie.findById(movieId);
  return movie;
}

module.exports = {
  createMovieService,
  deleteMovieService,
  getMoviesService,
};