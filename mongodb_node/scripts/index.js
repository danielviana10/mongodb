import { client, connect } from "../db/conn.js";


async function run() {
    try {
        const db = await connect();

        const users = db.collection("accounts");

        const accounts = {
            account_id: 'MD123456789',
            account_holder: 'Daniel Viana',
            account_type: 'checking',
            balance: 1971.50,
            transfer_completed: [
                "123456789",
                "987654321",
                "456789123",
                "321654987",
                "654321789"
            ],
            address: {
                city: 'São Paulo',
                state: 'SP',
                zip_code: '12345-678',
                country: 'Brazil',
                number: 123,
                street: 'Rua Exemplo'
            }
        };

        const result = await users.insertOne(accounts);

        console.log(result);
    } catch (error) {
        console.error("Erro ao inserir conta:", error);
    } finally {
        await client.close();
        console.log("Conexão com MongoDB fechada");
    }


}

run();