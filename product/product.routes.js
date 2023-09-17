import express from "express";
import {
  isBuyer,
  isSeller,
  isUser,
} from "../authication/authication.middlerware.js";
import {
  addProduct,
  delProduct,
  getAllProduct,
  getProduct,
  getSellerProduct,
  productEdit,
} from "./product.service.js";
import { addProductValidationSchema } from "./product.validation.js";
import { Product } from "./product.model.js";
import { checkMongooseIdValidity } from "../utils/util.js";

const router = express.Router();

//add product
router.post("/product/adds", isSeller, addProduct);

//delete product
router.delete("/product/delete/:id", isSeller, delProduct);

//get product detail
router.get("/product/detail/:id", isUser, getProduct);

//get product by buyer
router.post("/product/buyer/all", isBuyer, getAllProduct);

//get product by seller
router.post("/product/seller/all", isSeller, getSellerProduct);

//edit product detail
router.put("/product/edit/:id", isSeller, productEdit);

export default router;
