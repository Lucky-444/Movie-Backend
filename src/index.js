const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();

const connectDB = require("./others/db");
const movieRoutes = require("./routes/movie.routes");
const theatreRoutes = require("./routes/theatre.routes");

// ALWAYS convert env to number or fallback
const port = Number(process.env.PORT) || 3000;

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

movieRoutes(app);
theatreRoutes(app);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
