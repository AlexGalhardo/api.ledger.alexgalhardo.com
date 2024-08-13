"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moongose_1 = require("../config/moongose");
const node_crypto_1 = require("node:crypto");
const graphql_1 = require("graphql");
const bcrypt_util_1 = require("../utils/bcrypt.util");
const create_account_validator_1 = require("../validators/create-account.validator");
const TransactionTypeEnum = new graphql_1.GraphQLEnumType({
    name: "TransactionType",
    values: {
        PIX: { value: "PIX" },
        TED: { value: "TED" },
        DOC: { value: "DOC" },
        DEPOSIT: { value: "DEPOSIT" },
    },
});
var EnumTransactionType;
(function (EnumTransactionType) {
    EnumTransactionType["PIX"] = "PIX";
    EnumTransactionType["TED"] = "TED";
    EnumTransactionType["DOC"] = "DOC";
    EnumTransactionType["DEPOSIT"] = "DEPOSIT";
})(EnumTransactionType || (EnumTransactionType = {}));
const TransactionType = new graphql_1.GraphQLObjectType({
    name: "Transaction",
    fields: {
        _id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        source_account_id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        destination_account_id: { type: graphql_1.GraphQLID },
        amount: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
        description: { type: graphql_1.GraphQLString },
        type: { type: new graphql_1.GraphQLNonNull(TransactionTypeEnum) },
        created_at: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
    },
});
const AccountType = new graphql_1.GraphQLObjectType({
    name: "Account",
    fields: {
        _id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        balance: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
        created_at: { type: graphql_1.GraphQLString },
        updated_at: { type: graphql_1.GraphQLString },
        transactions: {
            type: new graphql_1.GraphQLList(TransactionType),
            resolve: async (account) => {
                return await moongose_1.Transaction.find({
                    $or: [{ source_account_id: account.id }, { destination_account_id: account.id }],
                });
            },
        },
    },
});
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        account: {
            type: AccountType,
            args: { _id: { type: graphql_1.GraphQLID } },
            resolve: async (_, args) => {
                return await moongose_1.Account.findOne({ _id: args._id });
            },
        },
        accounts: {
            type: new graphql_1.GraphQLList(AccountType),
            resolve: async () => {
                return await moongose_1.Account.find({});
            },
        },
        transaction: {
            type: TransactionType,
            args: { _id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) } },
            resolve: async (_, args) => {
                return await moongose_1.Transaction.findById(args._id);
            },
        },
        account_transactions: {
            type: new graphql_1.GraphQLList(TransactionType),
            args: { account_id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) } },
            resolve: async (_, args) => {
                return await moongose_1.Transaction.find({
                    $or: [{ source_account_id: args.account_id }, { destination_account_id: args.account_id }],
                });
            },
        },
        all_transactions: {
            type: new graphql_1.GraphQLList(TransactionType),
            resolve: async () => {
                return await moongose_1.Transaction.find({});
            },
        },
    },
});
const Mutation = new graphql_1.GraphQLObjectType({
    name: "Mutation",
    fields: {
        createAccount: {
            type: AccountType,
            args: {
                name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve: async (_, args) => {
                try {
                    create_account_validator_1.default.parse(args);
                    const emailAlreadyRegistred = await moongose_1.Account.findOne({ email: args.email });
                    if (emailAlreadyRegistred) {
                        throw new Error("Email already registered");
                    }
                    const account = new moongose_1.Account({
                        name: args.name,
                        email: args.email,
                        password: await bcrypt_util_1.Bcrypt.hash(args.password),
                        balance: 0,
                    });
                    await account.save();
                    return account;
                }
                catch (error) {
                    throw new Error(error.message);
                }
            },
        },
        createTransaction: {
            type: TransactionType,
            args: {
                source_account_id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                destination_account_id: { type: graphql_1.GraphQLID },
                amount: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
                description: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                type: { type: new graphql_1.GraphQLNonNull(TransactionTypeEnum) },
            },
            resolve: async (_, args) => {
                try {
                    const sourceAccount = await moongose_1.Account.findOne({ _id: args.source_account_id });
                    if (!sourceAccount) {
                        throw new Error("Account not found");
                    }
                    if (args.type === EnumTransactionType.DEPOSIT) {
                        sourceAccount.balance += args.amount;
                        await sourceAccount.save();
                    }
                    else {
                        if (sourceAccount.balance < args.amount) {
                            throw new Error("Insufficient balance to create transaction");
                        }
                        const destinationAccount = args.destination_account_id
                            ? await moongose_1.Account.findOne({ _id: args.destination_account_id })
                            : null;
                        if (args.destination_account_id && !destinationAccount) {
                            throw new Error("Destination account not found");
                        }
                        sourceAccount.balance -= args.amount;
                        destinationAccount.balance += args.amount;
                        await sourceAccount.save();
                        await destinationAccount.save();
                    }
                    const transaction = new moongose_1.Transaction({
                        transaction_id: (0, node_crypto_1.randomUUID)(),
                        source_account_id: args.source_account_id,
                        destination_account_id: args.destination_account_id
                            ? args.destination_account_id
                            : args.source_account_id,
                        amount: args.amount,
                        description: args.description,
                        type: args.type,
                    });
                    await transaction.save();
                    return transaction;
                }
                catch (error) {
                    throw new Error(error.message);
                }
            },
        },
    },
});
const GraphqlSchema = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
exports.default = GraphqlSchema;
//# sourceMappingURL=schema.js.map