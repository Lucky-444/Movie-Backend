const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./others/db");

const movieRoutes = require("./routes/movie.routes");

//const mongoSanitize = require('express-mongo-sanitize');
// app.use(mongoSanitize());

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

connectDB();
//invoking routes with app obejct
app.get("/", (req, res) => {
         res.send("Hello World!");
});

movieRoutes(app);

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
