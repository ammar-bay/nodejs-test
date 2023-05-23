const mongoose = require("mongoose");
const DB = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9mbke.mongodb.net/`;

const connectDB = async () => {
  try {
    await mongoose.connect(DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (err) {
    console.log("Could not connect to DB");
    console.error(err);
  }
};

module.exports = connectDB;
