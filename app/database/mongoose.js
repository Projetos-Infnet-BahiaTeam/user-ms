const mongoose = require('mongoose');

require('dotenv').config();

class Database {
  constructor() {
    this.mongo();
  }

  mongo() {
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const dbName = process.env.DB_NAME;
    this.mongoConnection = mongoose.connect(`mongodb+srv://${user}:${password}@personalprojectscluster.jyth1.mongodb.net/${dbName}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then(() => {
        console.log("MongoDB connection established with success!")
      }).catch((error) => {
        console.log("Error: MongoDB connection was not established with success: " + error)
      });
  }
}

module.exports = new Database();