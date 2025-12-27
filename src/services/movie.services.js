const Movie = require("../models/movie.model");
const STATUS = require("../others/constants").STATUS;
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
      runValidators: true, // to run schema validators on update 
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

const fetchMovie = async(filter) => {
  let query = {};
  if(filter?.name){
    query.name = filter.name;
  }
  if(filter?.language){
    query.language = filter.language;
  }

  if(filter?.releaseStatus){
    query.releaseStatus = filter.releaseStatus;
  }

  if(filter?.releaseDate){
    query.releaseDate = { $gte: filter.releaseDate };
  }

  const movies = await Movie.find(query);

  if(!movies){
    throw{
      err : "No movie found",
      code: STATUS.NOT_FOUND,
    }
  }

  return movies;
}


module.exports = {
  createMovieService,
  deleteMovieService,
  getMoviesService,
  getAllMoviesFromService,
  updateMovieService,
  fetchMovie,
};