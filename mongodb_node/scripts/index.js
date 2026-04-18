require("dotenv").config({ path: "/lab/.env" });
const { MongoClient } = require("mongodb");

// Read connection string from environment variable
const uri = process.env.MONGODB_URI;

// Account IDs
const account_id_sender = "MDB574189300";
const account_id_receiver = "MDB343652528";

// Transaction amount
const transaction_amount = 100;

// Create a new MongoClient
const client = new MongoClient(uri);

const main = async () => {
    let session;
    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Get references to the database and collections
        const database = client.db("bank");
        const accounts = database.collection("accounts");
        const transfers = database.collection("transfers");

        // Start a client session
        session = client.startSession();

        // Define the transaction
        const transactionResults = await session.withTransaction(async () => {
            // TODO: (Step 1) Update the account sender balance
            const updateSenderResults = await accounts.updateOne(
                { account_id: account_id_sender },
                { $inc: { balance: -transaction_amount } },
                { session }
            );
            console.log(
                `${updateSenderResults.matchedCount} document(s) matched the filter, updated ${updateSenderResults.modifiedCount} document(s) for the sender account.`
            );

            // Step 2: Update the account receiver balance
            const updateReceiverResults = await accounts.updateOne(
                { account_id: account_id_receiver },
                { $inc: { balance: transaction_amount } },
                { session },
            );
            console.log(
                `${updateReceiverResults.matchedCount} document(s) matched the filter, updated ${updateReceiverResults.modifiedCount} document(s) for the receiver account.`,
            );

            // Step 3: Insert the transfer document
            const transfer = {
                transfer_id: "TR21872187",
                amount: 100,
                from_account: account_id_sender,
                to_account: account_id_receiver,
            };

            const insertTransferResults = await transfers.insertOne(transfer, {
                session,
            });
            console.log(
                `Successfully inserted ${insertTransferResults.insertedId} into the transfers collection`,
            );

            // Step 4: Update the transfers_complete field for the sender account
            const updateSenderTransferResults = await accounts.updateOne(
                { account_id: account_id_sender },
                { $push: { transfers_complete: transfer.transfer_id } },
                { session },
            );
            console.log(
                `${updateSenderTransferResults.matchedCount} document(s) matched in the transfers collection, updated ${updateSenderTransferResults.modifiedCount} document(s) for the sender account.`,
            );

            // Step 5: Update the transfers_complete field for the receiver account
            const updateReceiverTransferResults = await accounts.updateOne(
                { account_id: account_id_receiver },
                { $push: { transfers_complete: transfer.transfer_id } },
                { session },
            );
            console.log(
                `${updateReceiverTransferResults.matchedCount} document(s) matched in the transfers collection, updated ${updateReceiverTransferResults.modifiedCount} document(s) for the receiver account.`,
            );

            // Return a value to indicate successful transaction completion
            return true;
        });

        console.log("Committing transaction ...");
        // If the callback for withTransaction returns successfully without throwing an error, the transaction will be committed
        if (transactionResults) {
            console.log("The transaction was successfully created.");
        } else {
            console.log("The transaction was intentionally aborted.");
        }
    } catch (err) {
        console.error(`Transaction aborted: ${err}`);
        process.exit(1);
    } finally {
        if (session) {
            await session.endSession();
        }
        await client.close();
    }
};

main();
