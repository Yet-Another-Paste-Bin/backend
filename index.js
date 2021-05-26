const express = require("express");
const mongoose = require("mongoose");
const app = express();
const helmet = require("helmet");
const { env, DB_URL, frontendUrl, PORT } = require("./config");
const cors = require("cors");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
if (env === "development") {
  app.use(cors());
  app.use(require("morgan")("dev"));
} else {
  const prodCors = cors({ origin: frontendUrl });
  app.use(prodCors);
  app.options("*", prodCors);
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
