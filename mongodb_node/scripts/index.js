import { client, connect } from "../db/conn.js";


async function run() {
    const db = await connect();

    const usersCollection = db.collection("accounts");

    const documentsToFind = { balance: { $gt: 3000 } };

    try {

        const result = usersCollection.find(documentsToFind)
        const docCount = usersCollection.countDocuments(documentsToFind);
        await result.forEach(doc => console.log(doc));
        console.log('Total de documentos encontrados:', await docCount);
    } catch (error) {
        console.error("Erro ao inserir conta:", error);
    } finally {
        await client.close();
        console.log("Conexão com MongoDB fechada");
    }


}

run();