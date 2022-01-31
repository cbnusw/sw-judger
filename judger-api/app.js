const compression = require("compression");
const cors = require("cors");
const express = require("express");
const asyncHandler = require("express-async-handler");
const helmet = require("helmet");
const morgan = require("morgan");
const { join } = require("path");
const { FORBIDDEN } = require("./errors");
const { File } = require("./models");
const { IS_DEV, JUDGE_APP_HOST: HOST, UPLOAD_DIR } = require("./env");
const { notFound, errorHandler } = require("./errors/handlers");
const apiRouter = require("./routes/api");
const uploadRouter = require("./routes/upload");
const authRouter = require("./routes/auth");
const { stream } = require("./utils/logger");
const { authenticate } = require("./middlewares/auth");
const { createProducer } = require("./kafka");

const app = express();
const submitProducer = createProducer();

app.set("submitProducer", submitProducer);

app.use(helmet());
app.use(compression());

app.use(morgan(IS_DEV ? "dev" : "combined", { stream }));
app.use(cors());
app.use(
  `/${UPLOAD_DIR}`,
  authenticate,
  asyncHandler(async (req, res, next) => {
    const url = `${HOST}${req.originalUrl}`;
    const file = await File.findOne({ url });
    if (!file.validatePermission(req.user)) {
      return next(FORBIDDEN);
    }
    next();
  }),
  express.static(join(__dirname, UPLOAD_DIR))
);
// if (staticOptions) staticOptions.forEach(options => app.use(...options));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRouter);
app.use("/upload", uploadRouter);
app.use(apiRouter);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
