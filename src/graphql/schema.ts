import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLNonNull,
	GraphQLID,
	GraphQLFloat,
} from "graphql";

const TransactionType = new GraphQLObjectType({
	name: "Transaction",
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID) },
		amount: { type: new GraphQLNonNull(GraphQLFloat) },
		description: { type: GraphQLString },
		date: { type: new GraphQLNonNull(GraphQLString) },
	},
});

const AccountType = new GraphQLObjectType({
	name: "Account",
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID) },
		name: { type: new GraphQLNonNull(GraphQLString) },
		balance: { type: new GraphQLNonNull(GraphQLFloat) },
		transactions: {
			type: new GraphQLList(TransactionType),
			resolve: (account) => {
				return account.transactions || [];
			},
		},
	},
});

// Define the RootQuery
const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		account: {
			type: AccountType,
			args: { id: { type: GraphQLID } },
			resolve: (parent, args) => {
				return {
					id: args.id,
					name: "Sample Account",
					balance: 1000.0,
					transactions: [
						{
							id: "1",
							amount: 50.0,
							description: "Grocery Shopping",
							date: "2024-08-10",
						},
						{
							id: "2",
							amount: 20.0,
							description: "Gas Station",
							date: "2024-08-11",
						},
					],
				};
			},
		},
	},
});

const GraphqlSchema = new GraphQLSchema({
	query: RootQuery,
});


export default GraphqlSchema
