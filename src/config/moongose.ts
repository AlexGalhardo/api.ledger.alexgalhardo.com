import mongoose from "mongoose";

async function main() {
	await mongoose.connect("mongodb://root:root@localhost/ledger-mongodb?authSource=admin");

	try {
		const existingAccount = await Account.findOne({ account_id: process.env.DEFAULT_ACCOUNT_ID });

		if (!existingAccount) {
			const account = new Account({
				account_id: process.env.DEFAULT_ACCOUNT_ID || "default-account-id",
				name: "Default Account",
				balance: Number(process.env.DEFAULT_ACCOUNT_BALANCE) || 1000.0,
				created_at: new Date(),
				updated_at: new Date(),
			});

			await account.save();
			console.log("\n\n...Seeded account successfully!");
		} else {
			console.log("\n\n...Account already exists, skipping seeding");
		}
	} catch (error) {
		if (error.code === 11000) {
			console.log("\n\n...Account already exists, skipping seeding");
		} else {
			console.error("\n\n...Error seeding account:", error);
		}
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
		id: { type: String, default: () => new mongoose.Types.ObjectId(), unique: true },
		account_id: { type: String, required: true, ref: 'Account' },
		amount: { type: Number, required: true },
		description: { type: String },
		date: { type: Date, default: Date.now },
	},
	{ collection: "transactions" },
);

const Transaction = mongoose.model("Transaction", TransactionSchema);

const AccountSchema = new Schema(
	{
		id: { type: String, default: () => new mongoose.Types.ObjectId(), unique: true },
		account_id: { type: String, unique: true, required: true },
		name: { type: String, required: true },
		balance: { type: Number, default: 0 },
		transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
		updated_at: { type: Date, default: Date.now },
		created_at: { type: Date, default: Date.now },
	},
	{ collection: "accounts" },
);

const Account = mongoose.model("Account", AccountSchema);

export { Account, Transaction };
