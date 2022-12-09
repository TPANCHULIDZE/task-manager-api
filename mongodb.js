const {MongoClient, ObjectId}= require("mongodb");


const connectionURL =
  "mongodb+srv://tato123456:vV0FHpCadatqpRS8@cluster0.ov0wgvy.mongodb.net/task-maneger";
const databaseName = "task-maneger";

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to database");
    }

    const db = client.db(databaseName);
  }
);
