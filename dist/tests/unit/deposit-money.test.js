"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const mocks_1 = require("./mocks");
describe("Test GraphQL Mutation: createTransaction (Deposit Money)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mocks_1.MockAccount.mockData = [];
        mocks_1.MockTransaction.mockData = [];
    });
    it("should deposit money into the account successfully", async () => {
        const account = new mocks_1.MockAccount({
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
        const result = await (0, graphql_1.execute)({
            schema: mocks_1.schema,
            document: (0, graphql_1.parse)(mutation),
        });
        expect(result.errors).toBeUndefined();
        expect(result.data).toBeDefined();
        expect(result.data.createTransaction).toBeDefined();
        const updatedAccount = await mocks_1.MockAccount.findOne({ _id: "source_account_id" });
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
        const result = await (0, graphql_1.execute)({
            schema: mocks_1.schema,
            document: (0, graphql_1.parse)(mutation),
        });
        expect(result.errors).toBeDefined();
        expect(result.errors[0].message).toBe("Account not found");
    });
});
//# sourceMappingURL=deposit-money.test.js.map