"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const mocks_1 = require("./mocks");
describe("Test GraphQL Mutation: createAccount", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mocks_1.MockAccount.mockData = [];
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
        const result = await (0, graphql_1.execute)({
            schema: mocks_1.schema,
            document: (0, graphql_1.parse)(mutation),
        });
        expect(result.errors).toBeUndefined();
        expect(result.data).toBeDefined();
        expect(result.data.createAccount).toBeDefined();
    });
    it("should return an error if the email is already registered", async () => {
        const existingAccount = new mocks_1.MockAccount({
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
        const result = await (0, graphql_1.execute)({
            schema: mocks_1.schema,
            document: (0, graphql_1.parse)(mutation),
        });
        expect(result.errors).toBeDefined();
        expect(result.errors[0].message).toBe("Email already registered");
    });
});
//# sourceMappingURL=create-account.test.js.map