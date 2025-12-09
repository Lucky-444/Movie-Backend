const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");


const connectDB = require("./others/db");
const movieRoutes = require("./routes/movie.routes");

const port = process.env.PORT || 3000;
//const mongoSanitize = require('express-mongo-sanitize');
// app.use(mongoSanitize());

dotenv.config();
const app = express();


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();
//invoking routes with app obejct
app.get("/", (req, res) => {
         res.send("Hello World!");
});

movieRoutes(app);

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
