import { default as express } from "express";
import { isBuyer } from "../authication/authication.middlerware.js";
import {
  addTOCart,
  cartCount,
  cartDetail,
  removeItem,
  updateCart,
} from "./cart.service.js";
const router = express.Router();

//add to cart
router.post("/cart/add", isBuyer, addTOCart);

//remove a item from cart
router.put("/cart/remove/item/:id", isBuyer, removeItem);

//update cart
router.put("/cart/update/quantity/:id", isBuyer, updateCart);

//get cart
router.get("/cart/details", isBuyer, cartDetail);

router.get("/cart/total/item", isBuyer, cartCount);
export default router;
