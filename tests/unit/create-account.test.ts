import { parse, execute } from 'graphql';
import { schema, MockAccount } from './mocks';

describe("Test GraphQL Mutation: createAccount", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockAccount.mockData = [];
	});

	it("should create a new account successfully", async () => {
		const mutation = `
			mutation {
				createAccount(
				name: "RestClientAccount",
				email: "restclient@example.com",
				password: "qweBR!123")
				{
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
				password: "qweBR!123")
				{
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
