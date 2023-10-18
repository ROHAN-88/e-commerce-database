import { checkMongooseIdValidity } from "../utils/util.js";
import { checkIfProductExists, isOwnerOfProduct } from "./product.function.js";
import { Product } from "./product.model.js";
import {
  addProductValidationSchema,
  countVaidation,
  getAllProductsValidation,
} from "./product.validation.js";

//!add product
export const addProduct = async (req, res) => {
  const newProduct = req.body;
  //validate product
  try {
    await addProductValidationSchema.validateAsync(newProduct);

    newProduct.sellerId = req.userInfo._id;

    await Product.create(newProduct);
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }

  return res.status(200).send({ message: "Product Added" });
};

//!delete product by id
export const delProduct = async (req, res) => {
  const delProduct = req.params.id;
  try {
    //validate mongo ID
    const isValidMongoId = checkMongooseIdValidity(delProduct);
    if (!isValidMongoId) {
      return res.status(400).send({ message: "Invalid Mongo Id" });
    }

    //check if product exists
    const product = await checkIfProductExists({ _id: delProduct });

    const loggedInUserId = req.userInfo._id; //!not understood

    //logged in user must be a owner of that product
    isOwnerOfProduct(loggedInUserId, product.sellerId);

    //delete product
    await Product.deleteOne({ _id: delProduct });

    return res.status(200).send({ message: "Deleted Sucessfully" });
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }
};

//!get a product by id

export const getProduct = async (req, res) => {
  const productId = req.params.id;

  const isValidMongoId = checkMongooseIdValidity(productId);

  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid Mongo id" });
  }

  //check if product exists
  const product = await Product.findOne({ _id: productId });

  //if not product terminate
  if (!product) {
    return res.status(400).send({ message: "Product not found" });
  }
  return res.status(200).send(product);
  // console.log(productId)
};

//!get all product for Buyer
export const getAllProduct = async (req, res) => {
  const query = req.body;
  // console.log("hello from buyer");
  try {
    await getAllProductsValidation.validateAsync(query);
    // console.log(query);
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }

  //?match
  let match = {};

  if (query?.searchText) {
    match.name = { $regex: query.searchText, $options: "i" };
  }
  //?price
  let price = {};
  if (query?.minPrice) {
    price = { $gte: query.minPrice };
  }
  if (query?.maxPrice) {
    price = { ...price, $lte: query.maxPrice };
  }

  //?category
  if (query?.category?.length) {
    match.category = { $in: query.category };
  }

  if (Object.entries(price).length > 0) {
    match.price = price;
  }

  //?calculate skip
  const skip = (query.page - 1) * query.limit;

  const product = await Product.aggregate([
    {
      $match: match,
    },
    {
      $skip: skip,
    },
    {
      $limit: query.limit,
    },
  ]);
  // const totalItems = await Product.find({})
  const totalItems = await Product.find({}).count();

  const totalPage = Math.ceil(totalItems / query.limit);
  return res.status(200).send({ product, totalPage });
};

//!get all seller product
export const getSellerProduct = async (req, res) => {
  const query = req.body;
  const sellerIdFromAuthMiddleware = req.userInfo._id;
  try {
    await getAllProductsValidation.validateAsync(query);
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }

  let match = query.searchText
    ? {
        sellerId: sellerIdFromAuthMiddleware,
        name: { $regex: query.searchText, $options: "i" },
      }
    : {
        sellerId: sellerIdFromAuthMiddleware,
      };
  const skip = (query.page - 1) * query.limit;

  const product = await Product.aggregate([
    {
      $match: match,
    },
    {
      $skip: skip,
    },
    {
      $limit: query.limit,
    },
  ]);
  return res.status(200).send(product);
};

//!product edit
export const productEdit = async (req, res) => {
  // const product = req.body;
  const productBody = req.body;
  const productId = req.params.id;
  const userInfo = req.userInfo._id;
  try {
    //validate mongoose id
    const validateId = checkMongooseIdValidity(productId);
    if (!validateId) {
      return res.status(401).send("Invalid Id");
    }

    // find if product exist
    const productFind = await Product.findOne({ _id: productId });

    if (!productFind) {
      return res.status(400).send("Product not found");
    }

    //validate the product data
    const validation = await addProductValidationSchema.validateAsync(
      productBody
    );
    if (!validation) {
      return res.status(400).send({ message: e.message });
    }

    //?check if the product seller id equals to seller id
    const sellerId = productFind.sellerId;
    const isProductOwner = userInfo.equals(sellerId);
    if (!isProductOwner) {
      return res.status(401).send("not the owner of product");
    }
    //update the product
    const editedProduct = await Product.updateOne(
      { _id: productId },
      {
        $set: {
          imageUrl: productBody.imageUrl,
          name: productBody.name,
          company: productBody.company,
          description: productBody.description,
          price: productBody.price,
          freeShipping: productBody.freeShipping,
          quantity: productBody.quantity,
          category: productBody.category,
          color: productBody.color,
        },
      }
    );

    // console.log(editedProduct);
    res.status(200).send("Edited");
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }
};

//!latest Product
export const latestProduct = async (req, res) => {
  const count = req.params.count;
  const query = req.body;
  try {
    //!validating counts
    await countVaidation.validateAsync(count);

    let match = query.category
      ? {
          category: query.category,
        }
      : {};
    const latestProduct = await Product.aggregate([
      {
        $match: match,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: +count,
      },
    ]);

    return res.status(200).send(latestProduct);
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }
};
