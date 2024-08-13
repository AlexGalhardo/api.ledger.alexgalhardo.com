import { execute, parse } from "graphql";
import GraphqlSchema from "../../src/graphql/schema";

describe("Test GraphQL Mutation: createAccount", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.clearAllTimers();
	});

	it("should create a new account successfully", async () => {
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
			schema: GraphqlSchema,
			document: parse(mutation),
		});

		expect(result.errors).toBeUndefined();
		expect(result.data).toBeDefined();
		expect(result.data.createAccount).toBeDefined();
	});

	it("should return an error if the email is already registered", async () => {
		const mutationInsert = `
            mutation {
                createAccount(
                    name: "ExistingAccount",
                    email: "restclient@example.com",
                    password: "password"
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

		await execute({
			schema: GraphqlSchema,
			document: parse(mutationInsert),
		});

		const mutationDuplicate = `
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
			schema: GraphqlSchema,
			document: parse(mutationDuplicate),
		});

		expect(result.errors).toBeDefined();
		expect(result.errors![0].message).toBe("Email already registered");
	});
});
