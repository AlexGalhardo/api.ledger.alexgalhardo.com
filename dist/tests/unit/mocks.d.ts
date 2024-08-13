import { GraphQLObjectType, GraphQLSchema } from 'graphql';
export declare class MockAccount {
    data: any;
    constructor(data: any);
    static findOne(query: any): Promise<MockAccount>;
    save(): Promise<this>;
    static mockData: any[];
}
export declare class MockTransaction {
    data: any;
    constructor(data: any);
    save(): Promise<this>;
    static mockData: any[];
}
export declare enum EnumTransactionType {
    DEPOSIT = "DEPOSIT",
    WITHDRAW = "WITHDRAW",
    TRANSFER = "TRANSFER"
}
export declare const TransactionType: GraphQLObjectType<any, any>;
export declare const schema: GraphQLSchema;
