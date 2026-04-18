require("dotenv").config({ path: "/lab/.env" });
const { MongoClient } = require("mongodb");

if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI in .env");
}

const client = new MongoClient(process.env.MONGODB_URI);
const documentsToDelete = { balance: { $lt: 500 } }

async function main() {
    try {
        await client.connect();
        const db = client.db("bank");
        const accountsCollection = db.collection("accounts");

        // TODO: Assign the result of the deleteMany operation to a variable called `result`
        const result = await accountsCollection.deleteMany(documentsToDelete)

        console.log(`Deleted documents: ${result.deletedCount}`);
    } catch (error) {
        console.error(`Error deleting documents: ${error}`);
        throw error;
    } finally {
        await client.close();
    }
}

main().catch((error) => console.error(error));
