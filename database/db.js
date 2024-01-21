const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017/openinapp"; // Update with your MongoDB connection string

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client
  .connect()
  .then(() => {
    console.log("MongoDB connection successfully established");
  })
  .catch((error) => console.error("Error connecting to MongoDB:", error));

module.exports = client;
