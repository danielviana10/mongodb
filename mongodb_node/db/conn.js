import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

async function connect() {
    if (db) return db;

    try {
        await client.connect();
        console.log("Conectado ao MongoDB");

        db = client.db("bank_mongodb");
        return db;
    } catch (error) {
        console.error("Erro ao conectar:", error);
    }
}

export { connect, client };