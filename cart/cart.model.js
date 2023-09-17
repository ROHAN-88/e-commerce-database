import mongoose from "mongoose";

const productDataSchema = new mongoose.Schema({
  productId: {
    type: mongoose.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const cartSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.ObjectId,
    ref: "User",
    required: true,
  },
  productList: {
    type: [productDataSchema],
  },
});
export const Cart = mongoose.model("Cart", cartSchema);
