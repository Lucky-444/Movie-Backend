const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Succefully Connected");
  } catch (error) {
    console.log("Error while connecting to DB", error);
  }
};

module.exports = connectDB;
