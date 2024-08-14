import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLNonNull,
	GraphQLID,
	GraphQLInt
} from 'graphql';
import CreateAccountValidator from '../../src/validators/create-account.validator';
import { randomUUID } from 'node:crypto';

export class MockAccount {
	constructor(public data: any) { }

	static async findOne(query: any) {
		const account = this.mockData.find((account: any) => account._id === query._id);
		return account ? new MockAccount(account) : null;
	}

	async save() {
		const index = MockAccount.mockData.findIndex((acc) => acc._id === this.data._id);
		if (index !== -1) {
			MockAccount.mockData[index] = this.data;
		} else {
			MockAccount.mockData.push(this.data);
		}
		return this;
	}

	static mockData: any[] = [];
}

export class MockTransaction {
	constructor(public data: any) { }

	async save() {
		MockTransaction.mockData.push(this.data);
		return this;
	}

	static mockData: any[] = [];
}

export enum EnumTransactionType {
	DEPOSIT = "DEPOSIT",
	WITHDRAW = "WITHDRAW",
	PIX = "PIX",
	TED = "TED",
	DOC = "DOC"
}

export const TransactionType = new GraphQLObjectType({
	name: 'Transaction',
	fields: {
		_id: { type: GraphQLString },
		source_account_id: { type: GraphQLString },
		destination_account_id: { type: GraphQLString },
		amount: { type: GraphQLInt },
		description: { type: GraphQLString },
		type: { type: GraphQLString },
		created_at: { type: GraphQLString },
	},
});

export const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		fields: {
			dummy: {
				type: GraphQLString,
				resolve: () => 'dummy',
			},
		},
	}),
	mutation: new GraphQLObjectType({
		name: 'Mutation',
		fields: {
			createAccount: {
				type: new GraphQLObjectType({
					name: 'Account',
					fields: {
						_id: { type: GraphQLString },
						name: { type: GraphQLString },
						email: { type: GraphQLString },
						balance: { type: GraphQLString },
						created_at: { type: GraphQLString },
						updated_at: { type: GraphQLString },
					},
				}),
				args: {
					name: { type: new GraphQLNonNull(GraphQLString) },
					email: { type: new GraphQLNonNull(GraphQLString) },
					password: { type: new GraphQLNonNull(GraphQLString) },
				},
				resolve: async (_, args) => {
					CreateAccountValidator.parse(args);

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
				type: TransactionType,
				args: {
					source_account_id: { type: new GraphQLNonNull(GraphQLID) },
					destination_account_id: { type: GraphQLID },
					amount: { type: new GraphQLNonNull(GraphQLInt) },
					description: { type: new GraphQLNonNull(GraphQLString) },
					type: { type: new GraphQLNonNull(GraphQLString) },
				},
				resolve: async (_, args) => {
					const sourceAccount = await MockAccount.findOne({ _id: args.source_account_id });
					if (!sourceAccount) {
						throw new Error("Account not found");
					}

					if (args.type === EnumTransactionType.DEPOSIT) {
						sourceAccount.data.balance += args.amount;
						await sourceAccount.save();
					} else {
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
						_id: randomUUID(),
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
