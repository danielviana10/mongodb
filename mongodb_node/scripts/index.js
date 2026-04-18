import { ObjectId } from "mongodb";
import { client, connect } from "../db/conn.js";


async function run() {
    const db = await connect();

    const usersCollection = db.collection("accounts");

    const documentsToFind = { _id: new ObjectId("69e30c604c3f45c75701d2c7") };

    try {
        const result = await usersCollection.findOne(documentsToFind);
        console.log("Um documento encontrado:");
        console.log(result);
    } catch (error) {
        console.error("Erro ao inserir conta:", error);
    } finally {
        await client.close();
        console.log("Conexão com MongoDB fechada");
    }


}

run();