require("dotenv").config({ path: "/lab/.env" });
const { MongoClient } = require("mongodb");

if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI in .env");
}

const client = new MongoClient(process.env.MONGODB_URI);

const pipeline = [
    // TODO: match accounts with a balance greater than 1000
    { $match: { balance: { $gt: 1000 } } },
    {
        $sort: {
            // TODO: sort accounts by balance in descending order
            balance: -1
        },
    },
    {
        $project: {
            // TODO: include the account_id, account_type, balance, and a new field called gdp_balance (divide the balance field by 1.3)
            account_id: 1,
            account_type: 1,
            balance: 1,
            gdp_balance: { $divide: ["$balance", 1.3] },
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