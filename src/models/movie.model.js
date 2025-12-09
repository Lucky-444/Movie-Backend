const mongoose = require("mongoose");
//mongoose.set('strictQuery', true);

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    casts: {
      type: [String],
      required: true,
    },
    trailerUrl: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: "English",
    },
    releaseDate: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    releaseStatus: {
      type: String,
      enum: ["RELEASED", "UNRELEASED", "BLOCKED"],
      required: true,
    },
  },
  { timestamps: true }
);


const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;