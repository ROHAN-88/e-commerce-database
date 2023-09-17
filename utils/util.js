import mongoose from "mongoose";

export const checkMongooseIdValidity = (id) => {
  const isValidMongoId = mongoose.Types.ObjectId.isValid(id);

  return isValidMongoId;
};
