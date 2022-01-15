const { MongoClient } = require("mongodb");
require("dotenv").config();

async function main(callback) {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected to database");
    await callback(client);
  } catch (error) {
    throw new Error("Unable to connect to the database");
  }
}

module.exports = main;
