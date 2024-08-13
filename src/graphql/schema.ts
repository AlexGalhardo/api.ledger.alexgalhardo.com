import { Account, Transaction } from "../config/moongose";
import { randomUUID } from "node:crypto";
import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLID,
    GraphQLInt,
    GraphQLEnumType,
} from "graphql";
import { Bcrypt } from "../utils/bcrypt.util";
import CreateAccountValidator from "../validators/create-account.validator";
import { ErrorsMessages } from "../utils/errors-messages.util";

const TransactionTypeEnum = new GraphQLEnumType({
    name: "TransactionType",
    values: {
        PIX: { value: "PIX" },
        TED: { value: "TED" },
        DOC: { value: "DOC" },
        DEPOSIT: { value: "DEPOSIT" },
    },
});

enum EnumTransactionType {
    PIX = "PIX",
    TED = "TED",
    DOC = "DOC",
    DEPOSIT = "DEPOSIT",
}

const TransactionType = new GraphQLObjectType({
    name: "Transaction",
    fields: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
        source_account_id: { type: new GraphQLNonNull(GraphQLID) },
        destination_account_id: { type: GraphQLID },
        amount: { type: new GraphQLNonNull(GraphQLInt) },
        description: { type: GraphQLString },
        type: { type: new GraphQLNonNull(TransactionTypeEnum) },
        created_at: { type: new GraphQLNonNull(GraphQLString) },
    },
});

const AccountType = new GraphQLObjectType({
    name: "Account",
    fields: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        balance: { type: new GraphQLNonNull(GraphQLInt) },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        transactions: {
            type: new GraphQLList(TransactionType),
            resolve: async (account) => {
                return await Transaction.find({
                    $or: [{ source_account_id: account.id }, { destination_account_id: account.id }],
                });
            },
        },
    },
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        account: {
            type: AccountType,
            args: { _id: { type: GraphQLID } },
            resolve: async (_, args) => {
                return await Account.findOne({ _id: args._id });
            },
        },
        accounts: {
            type: new GraphQLList(AccountType),
            resolve: async () => {
                return await Account.find({});
            },
        },
        transaction: {
            type: TransactionType,
            args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve: async (_, args) => {
                return await Transaction.findById(args._id);
            },
        },
        account_transactions: {
            type: new GraphQLList(TransactionType),
            args: { account_id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve: async (_, args) => {
                return await Transaction.find({
                    $or: [{ source_account_id: args.account_id }, { destination_account_id: args.account_id }],
                });
            },
        },
        all_transactions: {
            type: new GraphQLList(TransactionType),
            resolve: async () => {
                return await Transaction.find({});
            },
        },
    },
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createAccount: {
            type: AccountType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: async (_, args) => {
                try {
                    CreateAccountValidator.parse(args);

                    const emailAlreadyRegistred = await Account.findOne({ email: args.email });
                    if (emailAlreadyRegistred) {
                        throw new Error("Email already registered");
                    }

                    const account = new Account({
                        name: args.name,
                        email: args.email,
                        password: await Bcrypt.hash(args.password),
                        balance: 0,
                    });

                    await account.save();
                    return account;
                } catch (error: any) {
                    throw new Error(error.message);
                }
            },
        },
        createTransaction: {
            type: TransactionType,
            args: {
                source_account_id: { type: new GraphQLNonNull(GraphQLID) },
                destination_account_id: { type: GraphQLID },
                amount: { type: new GraphQLNonNull(GraphQLInt) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                type: { type: new GraphQLNonNull(TransactionTypeEnum) },
            },
            resolve: async (_, args, ctx) => {
                try {
                    // if (!ctx.user) throw new Error("Unauthorized");

                    const sourceAccount = await Account.findOne({ _id: args.source_account_id });
                    if (!sourceAccount) {
                        throw new Error(ErrorsMessages.ACCOUNT_NOT_FOUND);
                    }

                    if (args.type === EnumTransactionType.DEPOSIT) {
                        sourceAccount.balance += args.amount;
                        await sourceAccount.save();
                    } else {
                        if (sourceAccount.balance < args.amount) {
                            throw new Error(ErrorsMessages.INSUFFICIENT_BALANCE);
                        }

                        const destinationAccount = args.destination_account_id
                            ? await Account.findOne({ _id: args.destination_account_id })
                            : null;

                        if (args.destination_account_id && !destinationAccount) {
                            throw new Error(ErrorsMessages.DESTINATION_ACCOUNT_NOT_FOUND);
                        }

                        sourceAccount.balance -= args.amount;
                        destinationAccount.balance += args.amount;
                        await sourceAccount.save();
                        await destinationAccount.save();
                    }

                    const transaction = new Transaction({
                        transaction_id: randomUUID(),
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
                } catch (error: any) {
                    throw new Error(error.message);
                }
            },
        },
    },
});

const GraphqlSchema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});

export default GraphqlSchema;
