import mongoose from "mongoose";

const db_connect = async () => {
  const db_url = process.env.MONGO_URL;
  try {
    await mongoose.connect(db_url);
    console.log("Database : OK");
  } catch (e) {
    console.log("Database connection error");
    console.log(e.message);
  }
};

export default db_connect;
