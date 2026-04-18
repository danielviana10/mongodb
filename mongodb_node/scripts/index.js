require("dotenv").config({ path: "/lab/.env" });
const { MongoClient } = require("mongodb");

if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI in .env");
}

const client = new MongoClient(process.env.MONGODB_URI);
const pipeline = [
    // TODO: match accounts with a balance lesser than 1000
    { $match: { balance: { $lt: 1000 } } },
    {
        $group: {
            // TODO: Calculate average balance and total balance for each type of account
            _id: "$account_type",
            total_balance: { $sum: "$balance" },
            avg_balance: { $avg: "$balance" },
        },
    },
];

async function main() {
    try {
        await client.connect();
        const db = client.db("bank");
        const accountsCollection = db.collection("accounts");

        const result = await accountsCollection.aggregate(pipeline).toArray();

        console.log(`Aggregation result: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
        console.error(`Error running aggregation: ${error}`);
        throw error;
    } finally {
        await client.close();
    }
}

main().catch((error) => console.error(error));