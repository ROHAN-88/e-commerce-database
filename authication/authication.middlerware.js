import jwt from "jsonwebtoken";
import { User } from "../user/user.model.js";
import { accesTokenSecret } from "../constant/constant.js";

//!is seller midderware

export const isSeller = async (req, res, next) => {
  //extract token from header
  const authorization = req?.headers?.authorization;
  const splitterArray = authorization?.split(" ");
  const token = splitterArray[1];
  //if not token terminate
  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  try {
    //decrypt the token
    const userData = jwt.verify(
      token,
      process.env.ACCESS_TOKEN || accesTokenSecret
    );
    //find the user
    const user = await User.findOne({ email: userData.email });

    if (!user) {
      return res.status(401).send("Unauthorized-decrpt");
    }
    //if user role is seller terminate
    if (user.role !== "seller") {
      return res.status(401).send("Unauthorized");
    }

    //add user to req
    req.userInfo = user;
    next();
  } catch (e) {
    return res.status(400).send({ message: "Unauthorized" });
  }
};
//!is buyer
export const isBuyer = async (req, res, next) => {
  const authorization = req?.headers?.authorization;

  const splitterArray = authorization.split(" ");
  const token = splitterArray[1];

  if (!token) {
    return res.status(400).send({ message: "Unauthorized" });
  }

  try {
    const userData = jwt.verify(
      token,
      process.env.ACCESS_TOKEN || accesTokenSecret
    );

    const user = await User.findOne({ email: userData.email });
    if (!user) {
      return res.status(400).send({ message: "Unauthorized" });
    }

    if (user.role !== "buyer") {
      return res.status(400).send({ message: "Unauthozied" });
    }

    //add user to req
    req.userInfo = user;
    next();
  } catch (e) {
    return res.status(400).send({ message: "Unauthorized" });
  }
};
//!is user
export const isUser = async (req, res, next) => {
  //extract token from header
  const authorization = req?.headers?.authorization;
  const splitterArray = authorization?.split(" ");

  const token = splitterArray[1];

  //if not token terminate
  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  try {
    //decrypt the token
    const userData = jwt.verify(
      token,
      process.env.ACCESS_TOKEN || accesTokenSecret
    );
    //find the user
    const user = await User.findOne({ email: userData.email });

    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    //add user to req
    req.userInfo = user;
    next();
  } catch (e) {
    return res.status(400).send({ message: "Unauthorized" });
  }
};
