const mongoose = require("mongoose");
const { mongoAtlasURL } = require("../secret");

const connectDB = async (options = {}) => {
  try {
    mongoose.connect(mongoAtlasURL, options);
    console.log("Connectinos DB successfully");
    mongoose.connection.on("Error", (error) => {
      console.log(`Connection DB error :${error}`);
    });
  } catch (error) {
    console.log(`Connecting DB failed ${error.toString()}`);
  }
};

module.exports = connectDB;
