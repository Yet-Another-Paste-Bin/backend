const express = require("express");
const mongoose = require("mongoose");
const app = express();
const helmet = require("helmet");
const { env, DB_URL, frontendUrl, PORT } = require("./config");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
if (env === "development") {
  app.use(require("cors")());
  app.use(require("morgan")("dev"));
} else {
  app.use(require("cors")({ origin: frontendUrl }));
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
