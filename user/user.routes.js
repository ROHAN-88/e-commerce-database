import express from "express";
import {
  checkUser,
  login,
  newUser,
  validationUser,
  validatelogin,
} from "./user.service.js";
const router = express.Router();

//validation
//check

router.post("/user/register", checkUser, validationUser, newUser);

//using post instead of get cause axios dosenot take get request
router.post("/user/login", validatelogin, login);
// router.get("/user/login", (req, res) => {});
export default router;
