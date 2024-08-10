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

const TransactionTypeEnum = new GraphQLEnumType({
	name: "TransactionType",
	values: {
		PIX: { value: "PIX" },
		TED: { value: "TED" },
		DOC: { value: "DOC" },
		DEPOSIT: { value: "DEPOSIT" },
	},
});

const TransactionType = new GraphQLObjectType({
	name: "Transaction",
	fields: {
		transaction_id: { type: new GraphQLNonNull(GraphQLString) },
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
		account_id: { type: new GraphQLNonNull(GraphQLString) },
		owner_name: { type: new GraphQLNonNull(GraphQLString) },
		owner_email: { type: GraphQLString },
		balance: { type: new GraphQLNonNull(GraphQLInt) },
		created_at: { type: GraphQLString },
		updated_at: { type: GraphQLString },
		transactions: {
			type: new GraphQLList(TransactionType),
			resolve: async (account) => {
				return await Transaction.find({ source_account_id: account.id });
			},
		},
	},
});

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		account: {
			type: AccountType,
			args: { account_id: { type: GraphQLID } },
			resolve: async (parent, args) => {
				return await Account.findOne({ account_id: args.id });
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
			args: { transaction_id: { type: new GraphQLNonNull(GraphQLID) } },
			resolve: async (parent, args) => {
				return await Transaction.findById(args.id);
			},
		},
		account_transactions: {
			type: new GraphQLList(TransactionType),
			args: { account_id: { type: new GraphQLNonNull(GraphQLID) } },
			resolve: async (parent, args) => {
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
				owner_name: { type: new GraphQLNonNull(GraphQLString) },
				owner_email: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: async (parent, args) => {
				const account = new Account({
					account_id: randomUUID(),
					owner_name: args.owner_name,
					owner_email: args.owner_email,
					balance: 0,
				});
				try {
					await account.save();
					return account;
				} catch (error) {
					throw new Error("Error creating account: " + error.message);
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
			resolve: async (parent, args) => {
				const sourceAccount = await Account.findOne({ _id: args.source_account_id });
				if (!sourceAccount) {
					throw new Error("Account not found");
				}

				if (args.type === "DEPOSIT") {
					sourceAccount.balance += args.amount;
					await sourceAccount.save();
				} else {
					if (sourceAccount.balance < args.amount) {
						throw new Error("insufficient balance");
					}

					const destinationAccount = args.destination_account_id
						? await Account.findOne({ _id: args.destination_account_id })
						: null;

					if (args.destination_account_id && !destinationAccount) {
						throw new Error("Destination account not found");
					}

					sourceAccount.balance -= args.amount;
					destinationAccount.balance += args.amount;
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
			},
		},
	},
});

const GraphqlSchema = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});

export default GraphqlSchema;
