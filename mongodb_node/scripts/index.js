import { ObjectId } from "mongodb";
import { client, connect } from "../db/conn.js";


async function run() {
    const db = await connect();

    const usersCollection = db.collection("accounts");

    const documentToDelete = { _id: new ObjectId("69e30c604c3f45c75701d2c7") }

    try {
        const result = await usersCollection.deleteOne(documentToUpdate)
        result.deletedCount === 1
            ? console.log("Deleted one document")
            : console.log("No documents deleted");
    } catch (error) {
        console.error("Erro ao inserir conta:", error);
    } finally {
        await client.close();
        console.log("Conexão com MongoDB fechada");
    }


}

run();