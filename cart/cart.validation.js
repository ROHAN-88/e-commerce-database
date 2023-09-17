import Joi from "joi";

export const cartValidation = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().required().min(1),
});

export const actionValidationSchema = Joi.object({
  action: Joi.string().required().valid("increase", "decrease"),
});
