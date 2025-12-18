const Movie = require("../models/movie.model");

const createMovieService = async (movieData) => {
  const movie = await Movie.create(movieData);
  return movie;
}

const deleteMovieService = async (movieId) => {
  const deletedMovie = await Movie.findByIdAndDelete(movieId);
  return deletedMovie;
}
const getMoviesService = async (movieId) => {
  const movie = await Movie.findById(movieId);
  return movie;
}


const getAllMoviesFromService = async () => {
  const movies = await Movie.find({});

  return movies ; 
}


const updateMovieService = async (id, data) => {
  try {
    const movie = await Movie.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return movie;
  } catch (error) {
    if (error.name == "ValidationError") {
      let err = {};
      Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
      });
      console.log(err);
      throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
    } else {
      throw error;
    }
  }
};

module.exports = {
  createMovieService,
  deleteMovieService,
  getMoviesService,
  getAllMoviesFromService,
  updateMovieService,
};