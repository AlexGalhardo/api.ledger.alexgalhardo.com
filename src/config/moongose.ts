import mongoose from "mongoose";
import { randomUUID } from "node:crypto";

async function main() {
	await mongoose.connect("mongodb://root:root@localhost/ledger-mongodb?authSource=admin");

	try {
		const existingAccount = await Account.findOne({ account_id: process.env.DEFAULT_ACCOUNT_ID });

		if (!existingAccount) {
			const account = new Account({
				account_id: "default-account-id",
				owner_name: "Default Owner",
				owner_email: "default@example.com",
				balance: 0,
				created_at: new Date(),
				updated_at: new Date(),
			});

			await account.save();
			console.log("\n\n...Created default account successfully!");
		}
	} catch (error) {
		console.log("ERROR creating default account: ", error.message);
	}
}

main().catch((err) => console.log(err));

const mongodb = mongoose.connection;

mongodb.on("error", console.error.bind(console, "\n\n...ERROR to connect to MongoDB: "));

mongodb.once("open", () => {
	console.log("\n\n...Connected to MongoDB!");
});

const { Schema } = mongoose;

const TransactionSchema = new Schema(
	{
		transaction_id: { type: String, unique: true },
		source_account_id: { type: String, required: true, ref: "Account" },
		destination_account_id: { type: String, required: true, ref: "Account" },
		amount: { type: Number, required: true },
		description: { type: String },
		type: {
			type: String,
			enum: ["PIX", "TED", "DOC", "DEPOSIT"],
			required: true,
		},
		success: {
			type: Boolean,
			required: false,
		},
		created_at: { type: Date, default: Date.now },
	},
	{ collection: "transactions" },
);

const Transaction = mongoose.model("Transaction", TransactionSchema);

const AccountSchema = new Schema(
	{
		account_id: { type: String, unique: true },
		owner_name: { type: String, required: true },
		owner_email: { type: String, required: true, unique: true },
		balance: { type: Number, default: 0 },
		transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
		updated_at: { type: Date, default: Date.now },
		created_at: { type: Date, default: Date.now },
	},
	{ collection: "accounts" },
);

const Account = mongoose.model("Account", AccountSchema);

export { Account, Transaction };
