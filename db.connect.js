import mongoose from "mongoose";

const db_connect = async () => {
  const db =
    "mongodb+srv://therohanshrestha6655:m51VMBYhAkmL3YlV@cluster0.gpvkzma.mongodb.net/E-commerce?retryWrites=true&w=majority";
  const db_url = process.env.MONGO_URL || db;
  try {
    await mongoose.connect(db_url);
    console.log("Database : OK");
  } catch (e) {
    console.log("Database connection error");
    console.log(e.message);
  }
};

export default db_connect;
