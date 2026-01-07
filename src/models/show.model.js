const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
  {
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    timing: {
      type: String,
      required: true,
    },
    noOfSeats: {
      type: Number,
      required: true,
    },
    seatConfiguration: {
      type: String, //for frontend to render seat layout (eg: "A1,A2,A3;B1,B2,B3")
    },
    price: { //price per seat
      type: Number,
      required: true,
    },
    format: { //eg: 2D, 3D, IMAX
      type: String,
    },
  },
  { timestamps: true }
);

const Show = mongoose.model("Show", showSchema);

module.exports = Show;
