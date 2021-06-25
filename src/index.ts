import express, { Application, Request, Response, NextFunction } from "express";
import { connect } from "mongoose";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import AuthRoutes from "./routes/auth.route";
import BinRoutes from "./routes/bin.route";
import Morgan from "morgan";
import { DB_URL, PORT, env } from "./config";

const app: Application = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
const corsOpts = cors({ origin: true });
app.use(corsOpts);
app.options("*", corsOpts);

if (env === "development") {
  app.use(Morgan("dev"));
} else {
  // Enable gZip compression with threshold 2kb
  app.use(compression({ threshold: "2kb" }));
}

connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

AuthRoutes(app);
BinRoutes(app);
app.listen(PORT, () => {
  console.log(`Listening at Port ${PORT}`);
});
