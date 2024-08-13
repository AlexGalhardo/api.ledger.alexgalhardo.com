import {
	parse,
	execute,
} from 'graphql';
import { schema, MockAccount, MockTransaction } from './mocks';


describe("Test GraphQL Mutation: createTransaction (Deposit Money)", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockAccount.mockData = [];
		MockTransaction.mockData = [];
	});

	it("should deposit money into the account successfully", async () => {
		const account = new MockAccount({
			_id: "source_account_id",
			name: "ExistingAccount",
			email: "restclient@example.com",
			password: "password",
			balance: 0,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		});
		await account.save();

		const mutation = `
			mutation {
				createTransaction(
					source_account_id: "source_account_id",
					amount: 1200,
					description: "Deposit",
					type: "DEPOSIT"
				) {
					_id
					amount
					description
					created_at
					source_account_id
					type
				}
			}
			`;

		const result = await execute({
			schema,
			document: parse(mutation),
		});

		expect(result.errors).toBeUndefined();
		expect(result.data).toBeDefined();
		expect(result.data.createTransaction).toBeDefined();

		const updatedAccount = await MockAccount.findOne({ _id: "source_account_id" });
		expect(updatedAccount.data.balance).toBe(1200);
	});

	it("should return an error if the account does not exist", async () => {
		const mutation = `
			mutation {
				createTransaction(
					source_account_id: "non_existent_account_id",
					amount: 1200,
					description: "Deposit",
					type: "DEPOSIT"
				) {
					_id
					amount
					description
					created_at
					source_account_id
					type
				}
			}
			`;

		const result = await execute({
			schema,
			document: parse(mutation),
		});

		expect(result.errors).toBeDefined();
		expect(result.errors[0].message).toBe("Account not found");
	});
});
