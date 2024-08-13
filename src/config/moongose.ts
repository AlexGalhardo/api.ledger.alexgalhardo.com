import mongoose from "mongoose";
import "dotenv/config";

async function main() {
    await mongoose.connect(process.env.MONGO_DB_URL ?? "mongodb://root:root@localhost/ledger-mongodb?authSource=admin");
}

main().catch((err) => console.log(err));

const mongodb = mongoose.connection;

mongodb.on("error", console.error.bind(console, "\n\n...ERROR connecting to Docker MongoDB"));

mongodb.once("open", () => {
    console.log("\n\n...Connected to Docker MongoDB!");
});

const { Schema } = mongoose;

const TransactionSchema = new Schema(
    {
        source_account_id: { type: String, required: true, ref: "Account" },
        destination_account_id: { type: String, required: true, ref: "Account" },
        amount: { type: Number, required: true },
        description: { type: String },
        type: {
            type: String,
            enum: ["PIX", "TED", "DOC", "DEPOSIT"],
            required: true,
        },
        created_at: { type: Date, default: Date.now },
    },
    { collection: "transactions" },
);

const Transaction = mongoose.model("Transaction", TransactionSchema);

const AccountSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        balance: { type: Number, default: 0 },
        transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
        updated_at: { type: Date, default: Date.now },
        created_at: { type: Date, default: Date.now },
    },
    { collection: "accounts" },
);

const Account = mongoose.model("Account", AccountSchema);

export { Account, Transaction };
