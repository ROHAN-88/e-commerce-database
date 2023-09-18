import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import { accesTokenSecret } from "../constant/constant.js";
import { User } from "./user.model.js";
import { loginValidationSchema, Uservalidation } from "./user.validation.js";
//!checking if user exist or not
export const checkUser = async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const register = req.body;

  const user = await User.findOne({ email: register.email });
  if (user) {
    return res.status(401).send("User already exits");
  }
  next();
};
//!validation
export const validationUser = async (req, res, next) => {
  const register = req.body;
  try {
    const validation = Uservalidation.validateAsync(register);
    next();
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
//!creats new user
export const newUser = async (req, res) => {
  let register = req.body;

  try {
    const passwordHash = await bcrypt.hash(register.password, 8);
    register.password = passwordHash;

    //creat new user
    await User.create(register);

    return res.status(200).send("User register");
  } catch (e) {
    return res.status(401).send("User not register" + e.message);
  }
};
//!login creadential
export const validatelogin = async (req, res, next) => {
  const newUser = req.body;

  try {
    await loginValidationSchema.validateAsync(newUser);
    next();
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

//!log in
export const login = async (req, res) => {
  const login = req.body;
  //find
  const user = await User.findOne({ email: login.email });
  if (!user) {
    return res.status(400).send("Invaild Credentials");
  }
  //bcrypt to compare
  const passwordMatch = await bcrypt.compare(login.password, user.password);
  if (!passwordMatch) {
    return res.status(400).send("Invaild Credentials");
  }

  user.password = undefined;

  //access token
  const accesstoken = Jwt.sign(
    { email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
  return res.status(200).send({ user, accesstoken });
};
