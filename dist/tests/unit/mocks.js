"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = exports.TransactionType = exports.EnumTransactionType = exports.MockTransaction = exports.MockAccount = void 0;
const graphql_1 = require("graphql");
const create_account_validator_1 = require("../../src/validators/create-account.validator");
const node_crypto_1 = require("node:crypto");
class MockAccount {
    constructor(data) {
        this.data = data;
    }
    static async findOne(query) {
        const account = this.mockData.find((account) => account._id === query._id);
        return account ? new MockAccount(account) : null;
    }
    async save() {
        const index = MockAccount.mockData.findIndex((acc) => acc._id === this.data._id);
        if (index !== -1) {
            MockAccount.mockData[index] = this.data;
        }
        else {
            MockAccount.mockData.push(this.data);
        }
        return this;
    }
}
exports.MockAccount = MockAccount;
MockAccount.mockData = [];
class MockTransaction {
    constructor(data) {
        this.data = data;
    }
    async save() {
        MockTransaction.mockData.push(this.data);
        return this;
    }
}
exports.MockTransaction = MockTransaction;
MockTransaction.mockData = [];
var EnumTransactionType;
(function (EnumTransactionType) {
    EnumTransactionType["DEPOSIT"] = "DEPOSIT";
    EnumTransactionType["WITHDRAW"] = "WITHDRAW";
    EnumTransactionType["TRANSFER"] = "TRANSFER";
})(EnumTransactionType || (exports.EnumTransactionType = EnumTransactionType = {}));
exports.TransactionType = new graphql_1.GraphQLObjectType({
    name: 'Transaction',
    fields: {
        _id: { type: graphql_1.GraphQLString },
        source_account_id: { type: graphql_1.GraphQLString },
        destination_account_id: { type: graphql_1.GraphQLString },
        amount: { type: graphql_1.GraphQLInt },
        description: { type: graphql_1.GraphQLString },
        type: { type: graphql_1.GraphQLString },
        created_at: { type: graphql_1.GraphQLString },
    },
});
exports.schema = new graphql_1.GraphQLSchema({
    query: new graphql_1.GraphQLObjectType({
        name: 'Query',
        fields: {
            dummy: {
                type: graphql_1.GraphQLString,
                resolve: () => 'dummy',
            },
        },
    }),
    mutation: new graphql_1.GraphQLObjectType({
        name: 'Mutation',
        fields: {
            createAccount: {
                type: new graphql_1.GraphQLObjectType({
                    name: 'Account',
                    fields: {
                        _id: { type: graphql_1.GraphQLString },
                        name: { type: graphql_1.GraphQLString },
                        email: { type: graphql_1.GraphQLString },
                        balance: { type: graphql_1.GraphQLString },
                        created_at: { type: graphql_1.GraphQLString },
                        updated_at: { type: graphql_1.GraphQLString },
                    },
                }),
                args: {
                    name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                    email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                    password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                },
                resolve: async (_, args) => {
                    create_account_validator_1.default.parse(args);
                    const emailAlreadyRegistered = await MockAccount.findOne({ email: args.email });
                    if (emailAlreadyRegistered) {
                        throw new Error("Email already registered");
                    }
                    const account = new MockAccount({
                        name: args.name,
                        email: args.email,
                        password: args.password,
                        balance: 0,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    });
                    await account.save();
                    return account;
                },
            },
            createTransaction: {
                type: exports.TransactionType,
                args: {
                    source_account_id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                    destination_account_id: { type: graphql_1.GraphQLID },
                    amount: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
                    description: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                    type: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                },
                resolve: async (_, args) => {
                    const sourceAccount = await MockAccount.findOne({ _id: args.source_account_id });
                    if (!sourceAccount) {
                        throw new Error("Account not found");
                    }
                    if (args.type === EnumTransactionType.DEPOSIT) {
                        sourceAccount.data.balance += args.amount;
                        await sourceAccount.save();
                    }
                    else {
                        if (sourceAccount.data.balance < args.amount) {
                            throw new Error("Insufficient balance to create transaction");
                        }
                        if (args.destination_account_id) {
                            const destinationAccount = await MockAccount.findOne({ _id: args.destination_account_id });
                            if (!destinationAccount) {
                                throw new Error("Destination account not found");
                            }
                            destinationAccount.data.balance += args.amount;
                            await destinationAccount.save();
                        }
                        sourceAccount.data.balance -= args.amount;
                        await sourceAccount.save();
                    }
                    const transaction = new MockTransaction({
                        _id: (0, node_crypto_1.randomUUID)(),
                        source_account_id: args.source_account_id,
                        destination_account_id: args.destination_account_id || args.source_account_id,
                        amount: args.amount,
                        description: args.description,
                        type: args.type,
                        created_at: new Date().toISOString(),
                    });
                    await transaction.save();
                    return transaction;
                },
            },
        },
    }),
});
//# sourceMappingURL=mocks.js.map