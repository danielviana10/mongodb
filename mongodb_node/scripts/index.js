import { client, connect } from "../db/conn.js";


async function run() {
    try {
        const db = await connect();

        const users = db.collection("accounts");

        const accounts = [
            {
                account_id: 'MD123456789',
                account_holder: 'Daniel Viana',
                account_type: 'checking',
                balance: 1971.50,
            },
            {
                account_id: 'MD987654321',
                account_holder: 'Renato Giorgi',
                account_type: 'checking',
                balance: 3500.00,
            }
        ]

        const result = await users.insertMany(accounts);

        console.log(result);
    } catch (error) {
        console.error("Erro ao inserir conta:", error);
    } finally {
        await client.close();
        console.log("Conexão com MongoDB fechada");
    }


}

run();