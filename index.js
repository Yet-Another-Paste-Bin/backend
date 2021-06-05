const express = require("express");
const mongoose = require("mongoose");
const app = express();
const helmet = require("helmet");
const { env, DB_URL, PORT } = require("./config");
const cors = require("cors")();
const compression = require("compression");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(cors);
app.options("*", cors);

if (env === "development") {
  app.use(require("morgan")("dev"));
} else {
  // Enable gZip compression with threshold 2kb
  app.use(compression({ threshold: "2kb" }));
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
