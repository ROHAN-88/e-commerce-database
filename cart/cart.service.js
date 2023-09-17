import { default as e } from "express";
import { Product } from "../product/product.model.js";
import { checkMongooseIdValidity } from "../utils/util.js";
import { Cart } from "./cart.model.js";
import { actionValidationSchema, cartValidation } from "./cart.validation.js";
import mongoose from "mongoose";

//!add to cart function
export const addTOCart = async (req, res) => {
  //!destructure of data from req body
  const { productId, quantity } = req.body;
  const tovalidate = req.body;

  try {
    //?check if productid is validit mongoose id
    const validitMongooseId = checkMongooseIdValidity(productId);
    if (!validitMongooseId) {
      return res.status(400).send("Invalid mongoose id");
    }
    //validation of cart data
    const tovalidateCart = await cartValidation.validateAsync(tovalidate);
    if (!tovalidateCart) {
      return res.status(400).send({ message: e.message + "hello" });
    }
    //?check if product exist
    const product = Product.findOne({ _id: productId });

    if (!product) {
      return res.status(401).send("Product Does not exist");
    }

    //send error if quantity is more than product
    if (quantity > product.quantity) {
      return res.status(403).send("Out of stock");
    }

    //add item to cart of that buyer
    const buyerId = req.userInfo;

    //check if user cart has that product already
    const cartHasProduct = await Cart.findOne({
      buyerId: buyerId,
      "productList.productId": productId,
    });

    if (cartHasProduct) {
      await Cart.updateOne(
        {
          buyerId: buyerId,
          "productList.productId": productId,
        },
        {
          $inc: { "productList.$.quantity": quantity },
        }
      );
    } else {
      await Cart.updateOne(
        {
          buyerId: buyerId,
        },
        {
          $push: {
            productList: { productId, quantity },
          },
        },
        {
          upsert: true,
        }
      );
    }

    res.status(200).send({ meassage: "Item Added" });
  } catch (e) {
    res.status(400).send({ message: e.message });
    console.log(e);
  }
};

//!remove a array or object from a cart

export const removeItem = async (req, res) => {
  const userId = req.userInfo._id;
  const productId = req.params.id;
  //mongo id validation
  const validateId = checkMongooseIdValidity(productId);
  if (!validateId) {
    return res.status(400).send("Invalid mongo Id");
  }

  await Cart.updateOne(
    { buyerId: userId },
    {
      $pull: {
        productList: { productId: new mongoose.Types.ObjectId(productId) },
      },
    }
  );

  return res.status(200).send({ message: "Item removed" });
};

//!cart quantity update
export const updateCart = async (req, res) => {
  const body = req.body;
  const productId = req.params.id;

  //validating action body
  try {
    await actionValidationSchema.validateAsync(body);
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }

  //mongo id validation
  const validateId = checkMongooseIdValidity(productId);
  if (!validateId) {
    return res.status(400).send("Invalid mongo Id");
  }

  //check if product exist
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    return res.status(400).send("product Not found");
  }

  const buyerId = req.userInfo._id;

  //?sir code
  await Cart.updateOne(
    {
      buyerId: buyerId,
      "productList.productId": productId,
    },
    {
      $inc: {
        "productList.$.quantity": body.action === "increase" ? 1 : -1,
      },
    }
  );
  return res.status(200).send({ message: "Cart Updated " });
};

//!cart -item -count
export const cartCount = async (req, res) => {
  const loggedInUserId = req.userInfo._id;
  let itemCount = 0;

  const cart = await Cart.findOne({ buyerId: loggedInUserId });

  if (!cart) {
    itemCount = 0;
  }
  itemCount = cart?.productList?.length;
  return res.status(200).send({ itemCount });
};

//!cart detail
export const cartDetail = async (req, res) => {
  const loggedInUserId = req.userInfo._id;

  let data = await Cart.aggregate([
    {
      $match: { buyerId: loggedInUserId },
    },
    {
      $unwind: "$productList",
    },
    {
      $lookup: {
        from: "products",
        localField: "productList.productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $project: {
        name: { $first: "$productDetails.name" },
        company: { $first: "$productDetails.company" },
        unitPrice: { $first: "$productDetails.price" },
        availableQuantity: { $first: "$productDetails.quantity" },
        orderQuantity: "$productList.quantity",
        productId: { $first: "$productDetails._id" },
      },
    },
  ]);

  data = data?.map((item) => {
    const totalPrice = item.unitPrice * item.orderQuantity;

    return { ...item, totalPrice };
  });
  // console.log(data);
  return res.status(200).send(data);
};
