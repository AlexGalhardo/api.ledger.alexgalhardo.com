"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const mocks_1 = require("./mocks");
describe("Test GraphQL Mutation: createTransaction (Transfer Money)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mocks_1.MockAccount.mockData = [];
        mocks_1.MockTransaction.mockData = [];
    });
    it("should transfer money from Account A to Account B successfully", async () => {
        const accountA = new mocks_1.MockAccount({
            _id: "account_a_id",
            name: "AccountA",
            email: "accounta@example.com",
            password: "passwordA",
            balance: 2000,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
        await accountA.save();
        const accountB = new mocks_1.MockAccount({
            _id: "account_b_id",
            name: "AccountB",
            email: "accountb@example.com",
            password: "passwordB",
            balance: 500,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
        await accountB.save();
        const mutation = `
			mutation {
				createTransaction(
					source_account_id: "account_a_id",
					destination_account_id: "account_b_id",
					amount: 1000,
					description: "Transfer to Account B",
					type: "TRANSFER"
				) {
					_id
					amount
					description
					created_at
					source_account_id
					destination_account_id
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
        const updatedAccountA = await mocks_1.MockAccount.findOne({ _id: "account_a_id" });
        const updatedAccountB = await mocks_1.MockAccount.findOne({ _id: "account_b_id" });
        expect(updatedAccountA.data.balance).toBe(1000);
        expect(updatedAccountB.data.balance).toBe(1500);
    });
    it("should return an error if the source account does not have enough balance", async () => {
        const accountA = new mocks_1.MockAccount({
            _id: "account_a_id",
            name: "AccountA",
            email: "accounta@example.com",
            password: "passwordA",
            balance: 500,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
        await accountA.save();
        const accountB = new mocks_1.MockAccount({
            _id: "account_b_id",
            name: "AccountB",
            email: "accountb@example.com",
            password: "passwordB",
            balance: 500,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
        await accountB.save();
        const mutation = `
			mutation {
				createTransaction(
					source_account_id: "account_a_id",
					destination_account_id: "account_b_id",
					amount: 1000,
					description: "Transfer to Account B",
					type: "TRANSFER"
				) {
					_id
					amount
					description
					created_at
					source_account_id
					destination_account_id
					type
				}
			}
			`;
        const result = await (0, graphql_1.execute)({
            schema: mocks_1.schema,
            document: (0, graphql_1.parse)(mutation),
        });
        expect(result.errors).toBeDefined();
        expect(result.errors[0].message).toBe("Insufficient balance to create transaction");
        const updatedAccountA = await mocks_1.MockAccount.findOne({ _id: "account_a_id" });
        const updatedAccountB = await mocks_1.MockAccount.findOne({ _id: "account_b_id" });
        expect(updatedAccountA.data.balance).toBe(500);
        expect(updatedAccountB.data.balance).toBe(500);
    });
    it("should return an error if the destination account does not exist", async () => {
        const accountA = new mocks_1.MockAccount({
            _id: "account_a_id",
            name: "AccountA",
            email: "accounta@example.com",
            password: "passwordA",
            balance: 2000,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
        await accountA.save();
        const mutation = `
      mutation {
        createTransaction(
          source_account_id: "account_a_id",
          destination_account_id: "non_existent_account_id",
          amount: 1000,
          description: "Transfer to Account B",
          type: "TRANSFER"
        ) {
          _id
          amount
          description
          created_at
          source_account_id
          destination_account_id
          type
        }
      }
    `;
        const result = await (0, graphql_1.execute)({
            schema: mocks_1.schema,
            document: (0, graphql_1.parse)(mutation),
        });
        expect(result.errors).toBeDefined();
        expect(result.errors[0].message).toBe("Destination account not found");
        const updatedAccountA = await mocks_1.MockAccount.findOne({ _id: "account_a_id" });
        expect(updatedAccountA.data.balance).toBe(2000);
    });
});
//# sourceMappingURL=transfer-money.test.js.map