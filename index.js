const express = require("express");
const mongoose = require("mongoose");
const app = express();
const helmet = require("helmet");
const { env, DB_URL, frontendUrl, PORT } = require("./config");
const cors = require("cors");
const compression = require("compression");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
if (env === "development") {
  app.use(cors());
  app.use(require("morgan")("dev"));
} else {
  const prodCors = cors();
  app.use(prodCors);
  app.options("*", prodCors);

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
