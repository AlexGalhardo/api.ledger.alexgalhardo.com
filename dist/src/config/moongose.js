"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.Account = void 0;
const mongoose_1 = require("mongoose");
require("dotenv/config");
async function main() {
    var _a;
    await mongoose_1.default.connect((_a = process.env.MONGO_DB_URL) !== null && _a !== void 0 ? _a : "mongodb://root:root@localhost/ledger-mongodb?authSource=admin");
}
main().catch((err) => console.log(err));
const mongodb = mongoose_1.default.connection;
mongodb.on("error", console.error.bind(console, "\n\n...ERROR connecting to Docker MongoDB"));
mongodb.once("open", () => {
    console.log("\n\n...Connected to Docker MongoDB!");
});
const { Schema } = mongoose_1.default;
const TransactionSchema = new Schema({
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
}, { collection: "transactions" });
const Transaction = mongoose_1.default.model("Transaction", TransactionSchema);
exports.Transaction = Transaction;
const AccountSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
}, { collection: "accounts" });
const Account = mongoose_1.default.model("Account", AccountSchema);
exports.Account = Account;
//# sourceMappingURL=moongose.js.map