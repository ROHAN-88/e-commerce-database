import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../user/user.model.js";
import { Category } from "./category.model.js";

const router = express.Router();

// add category
router.post("/category/add", async (req, res) => {
  // extract header
  const authorization = req.headers.authorization;

  const splittedArray = authorization?.split(" ");

  const token = splittedArray[1];

  if (!token) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  //   decrypt the token
  try {
    const data = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

    const user = User.findOne({ email: data.email });

    if (!user) {
      return res.status(401).send({ message: "Unauthorized." });
    }
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  //   after user verification

  const newCategory = req.body;

  //   validate req.body
  const schema = Joi.object({
    name: Joi.string().required().trim().lowercase(),
  });

  try {
    await schema.validateAsync(newCategory);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }

  await Category.create(newCategory);

  return res.status(201).send({ message: "Category added successfully." });
});

export default router;
