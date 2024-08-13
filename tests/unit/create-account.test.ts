import { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLNonNull, parse, execute } from 'graphql';
import CreateAccountValidator from '../../src/validators/create-account.validator';

class MockAccount {
	constructor(public data: any) { }

	static async findOne(query: any) {
		return this.mockData.find((account: any) => account.email === query.email) || null;
	}

	async save() {
		MockAccount.mockData.push(this.data);
		return this;
	}

	static mockData: any[] = [];
}

const schema = new GraphQLSchema({
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
		},
	}),
});

describe("GraphQL Mutation: createAccount", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockAccount.mockData = [];
	});

	it("should create a new account successfully", async () => {
		CreateAccountValidator.parse = jest.fn().mockImplementation(() => { });

		const mutation = `
			mutation {
				createAccount(
				name: "RestClientAccount",
				email: "restclient@example.com",
				password: "qweBR!123"
				) {
				_id
				name
				email
				balance
				created_at
				updated_at
				}
			}
			`;

		const result = await execute({
			schema,
			document: parse(mutation),
		});

		expect(result.errors).toBeUndefined();
		expect(result.data).toBeDefined();
		expect(result.data.createAccount).toBeDefined();
	});

	it("should return an error if the email is already registered", async () => {
		CreateAccountValidator.parse = jest.fn().mockImplementation(() => { });

		const existingAccount = new MockAccount({
			name: "ExistingAccount",
			email: "restclient@example.com",
			password: "password",
			balance: '0',
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		});
		await existingAccount.save();

		const mutation = `
			mutation {
				createAccount(
				name: "DuplicateEmailAccount",
				email: "restclient@example.com",
				password: "qweBR!123"
				) {
				_id
				name
				email
				balance
				created_at
				updated_at
				}
			}
			`;

		const result = await execute({
			schema,
			document: parse(mutation),
		});

		expect(result.errors).toBeDefined();
		expect(result.errors[0].message).toBe("Email already registered");
	});
});
