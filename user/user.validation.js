import Joi from "joi";

export const Uservalidation = Joi.object({
  email: Joi.string().required().min(5).max(55).trim(),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required(),
  firstName: Joi.string().required().min(2).max(55),
  lastName: Joi.string().required().min(2).max(55),
  gender: Joi.string()
    .trim()
    .valid("male", "female", "preferNotToSay")
    .required(),
  role: Joi.string().required().valid("seller", "buyer"),
  dob: Joi.date().required(),
});

export const loginValidationSchema = Joi.object({
  email: Joi.string().email().required().trim(),
  password: Joi.string().required().trim(),
});
