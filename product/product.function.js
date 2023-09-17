import { Product } from "./product.model.js";

export const checkIfProductExists = async (obj) => {
  const product = await Product.findOne(obj);

  if (!product) {
    throw new Error("Product does not exist");
  }

  return product;
};

export const isOwnerOfProduct = (loggedInUserId, productSellerId) => {
  const isProductOwner = loggedInUserId.equals(productSellerId);

  // if not, terminate
  if (!isProductOwner) {
    throw new Error("You are not owner of this product.");
  }

  return;
};
