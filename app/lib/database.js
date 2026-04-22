import { MongoClient } from "mongodb";

const mongo_uri = process.env.DB_URI

let client;
let db;

const connectDatabase = async () => {
  if (!client) {
    client = new MongoClient(mongo_uri);
    await client.connect();
    db = client.db();
  }

  return db;
}


export {connectDatabase}