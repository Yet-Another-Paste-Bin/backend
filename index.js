const express = require("express");
const mongoose = require("mongoose");
const app = express();
const helmet = require("helmet");

// Get Port Number from Env (if exists) else set to 3000
const PORT = process.env.PORT || 3000;

// Get DB_URL from Env (if exists) else set to mongodb://localhost:27017/yapb
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/yapb";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
const env = process.env.NODE_ENV || "production";
if (env === "development") {
  app.use(require("cors")());
  app.use(require("morgan")("dev"));
} else {
  app.use(require("cors")({ origin: process.env.FRONTEND_URL }));
}

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
require("./routes/auth.route")(app);
require("./routes/bin.route")(app);
app.listen(PORT, () => {
  console.log(`Listening at Port ${PORT}`);
});
