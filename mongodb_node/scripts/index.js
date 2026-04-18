import { ObjectId } from "mongodb";
import { client, connect } from "../db/conn.js";


async function run() {
    const db = await connect();

    const usersCollection = db.collection("accounts");

    const documentsToDelete = { account_type: 'checking' }
    try {
        const result = await usersCollection.deleteMany(documentsToDelete)
        result.deletedCount > 0
            ? console.log(`Deleted ${result.deletedCount} documents`)
            : console.log("No documents deleted");
    } catch (error) {
        console.error("Erro ao inserir conta:", error);
    } finally {
        await client.close();
        console.log("Conexão com MongoDB fechada");
    }


}

run();