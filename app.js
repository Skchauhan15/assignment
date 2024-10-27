const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
var http = require("http").Server(app);
const { connect_socket } = require("./src/modules/task/socketio");
const userRouter = require("./src/modules/user/user_routes");
const uploadRouter = require("./src/modules/uploads/upload.routes");
const taskRouter = require('./src/modules/task/task_router');
const adminRouter = require("./src/modules/admin/admin_router");
const ratelimit = require("express-rate-limit");
const BootstrapHelper = require("./src/config/bootstrap")

const ratelimiter = ratelimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100,
})
require("dotenv").config();
const cookieparser = require("cookie-parser");
app.use(express.json()); //in latest express we don't need bodyparser express.json() done same
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(cors({ origin: "*" }));
app.use(fileUpload());
app.use(ratelimiter)

const port = process.env.PORT ||5000;
const path = require("path");
const connect_to_monogoose = require("./src/config/connection");
const swaggerUi = require("swagger-ui-express");
const openapi_docs = require("./output.swagger.json");

let swagger_options = { customSiteTitle: "Express Project Api Documentation" };
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(openapi_docs, swagger_options)
);

connect_to_monogoose();
(async () => {
  await BootstrapHelper.bootstrapData();
})()
app.get("/", async function (req, res) {
  res.send("hello world");
});
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/upload", uploadRouter);
app.use("/task", taskRouter)
http.listen(port, function (err) {
  if (err) {
    console.log(err);
  }

  console.log("listen at port " + port);
});
connect_socket(http);
