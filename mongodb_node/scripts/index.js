import { ObjectId } from "mongodb";
import { client, connect } from "../db/conn.js";


async function run() {
    const db = await connect();

    const usersCollection = db.collection("accounts");

    const documentToUpdate = { account_type: 'checking' }

    const update = { $push: { transfers_complete: "09876" } }

    try {
        const result = await usersCollection.updateMany(documentToUpdate, update)
        result.modifiedCount > 0
            ? console.log(`Updated ${result.modifiedCount} documents`)
            : console.log('No documents updated')
    } catch (error) {
        console.error("Erro ao inserir conta:", error);
    } finally {
        await client.close();
        console.log("Conexão com MongoDB fechada");
    }


}

run();