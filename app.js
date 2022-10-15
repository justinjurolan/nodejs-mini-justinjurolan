const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");
const { checkUser } = require("./util/is-auth");

const errorController = require("./controllers/error");

const MONGODB_URI =
  "mongodb+srv://justinjurolan:justinjurolan@cluster0.1b8n6ui.mongodb.net/users?retryWrites=true&w=majority";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("*", checkUser);
app.post("*", checkUser);
app.use("/admin", adminRoutes);
app.use(userRoutes);
app.use(authRoutes);

// app.get("/500", errorController.get500);

app.use(errorController.get404);

// app.use((error, req, res, next) => {
//   res.status(500).render("500", {
//     pageTitle: "Error!",
//     path: "/500",
//   });
// });

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000);
    console.log("CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });
