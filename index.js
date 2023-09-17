import express from "express";
import db_connect from "./db.connect.js";
import userRoutes from "./user/user.routes.js";
import productRouter from "./product/product.routes.js";
import cartRouter from "./cart/cart.routes.js";
const app = express();
//To make express understand json
app.use(express.json());

//!acces control
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Expose-Headers", "accessToken, refreshToken,");
    res.header(
      "Access-Control-Allow-Methods",
      "PUT, POST, PATCH, DELETE, GET, OPTIONS"
    );
    return res.status(200).json({});
  }

  return next();
});

//!Router

//login and signup router
app.use(userRoutes);
//product router
app.use(productRouter);
//cart router
app.use(cartRouter);

db_connect();
// console.log();/
const port = process.env.API_PORT;

app.listen(port, () => {
  console.log(`App is listening at ${port}`);
});
