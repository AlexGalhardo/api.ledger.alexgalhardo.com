import { execute, parse, GraphQLSchema } from "graphql";
import GraphqlSchema from "../../src/graphql/schema";
import { Account, Transaction } from "../../src/config/moongose";

describe("Test GraphQL Mutation: createTransaction (Deposit Money)", () => {
	let schema: GraphQLSchema;

	beforeAll(() => {
		schema = GraphqlSchema;
	});

	beforeEach(async () => {
		jest.clearAllMocks();
		await Account.deleteMany({});
		await Transaction.deleteMany({});
	});

	it("should deposit money into the account successfully", async () => {
		const account = new Account({
			name: "Test Account",
			email: "test@example.com",
			password: "password",
			balance: 0,
		});
		await account.save();

		const mutation = `
            mutation {
                createTransaction(
                    source_account_id: "${account._id}",
                    amount: 1200,
                    description: "Deposit",
                    type: DEPOSIT
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
		expect(result.data.createTransaction.amount).toBe(1200);
		expect(result.data.createTransaction.description).toBe("Deposit");
		expect(result.data.createTransaction.source_account_id).toBe(account._id.toString());
		expect(result.data.createTransaction.type).toBe("DEPOSIT");

		const updatedAccount = await Account.findById(account._id);
		expect(updatedAccount.balance).toBe(1200);
	});

	it("should return an error if the account does not exist", async () => {
		const nonExistentAccountId = "66bb6ad39755ad5858542880";

		const mutation = `
            mutation {
                createTransaction(
                    source_account_id: "${nonExistentAccountId}",
                    amount: 1200,
                    description: "Deposit",
                    type: DEPOSIT
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
