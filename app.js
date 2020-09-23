require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
 


//My routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const transRoutes = require("./routes/transaction");


//DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch(() => {
    console.log("error in connecting to DB");
  });

 

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());



//My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", transRoutes);

//PORT
const port = process.env.PORT || 5000;

//Starting a server
app.listen(port, () => {
  console.log(`api is running at ${port}`);
});
