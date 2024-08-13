import mongoose from "mongoose";
import "dotenv/config";
declare const Transaction: mongoose.Model<{
    source_account_id: string;
    type: "PIX" | "TED" | "DOC" | "DEPOSIT";
    destination_account_id: string;
    amount: number;
    created_at: Date;
    description?: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    source_account_id: string;
    type: "PIX" | "TED" | "DOC" | "DEPOSIT";
    destination_account_id: string;
    amount: number;
    created_at: Date;
    description?: string;
}> & {
    source_account_id: string;
    type: "PIX" | "TED" | "DOC" | "DEPOSIT";
    destination_account_id: string;
    amount: number;
    created_at: Date;
    description?: string;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    collection: string;
}, {
    source_account_id: string;
    type: "PIX" | "TED" | "DOC" | "DEPOSIT";
    destination_account_id: string;
    amount: number;
    created_at: Date;
    description?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    source_account_id: string;
    type: "PIX" | "TED" | "DOC" | "DEPOSIT";
    destination_account_id: string;
    amount: number;
    created_at: Date;
    description?: string;
}>> & mongoose.FlatRecord<{
    source_account_id: string;
    type: "PIX" | "TED" | "DOC" | "DEPOSIT";
    destination_account_id: string;
    amount: number;
    created_at: Date;
    description?: string;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
declare const Account: mongoose.Model<{
    name: string;
    created_at: Date;
    transactions: mongoose.Types.ObjectId[];
    email: string;
    password: string;
    balance: number;
    updated_at: Date;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    created_at: Date;
    transactions: mongoose.Types.ObjectId[];
    email: string;
    password: string;
    balance: number;
    updated_at: Date;
}> & {
    name: string;
    created_at: Date;
    transactions: mongoose.Types.ObjectId[];
    email: string;
    password: string;
    balance: number;
    updated_at: Date;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    collection: string;
}, {
    name: string;
    created_at: Date;
    transactions: mongoose.Types.ObjectId[];
    email: string;
    password: string;
    balance: number;
    updated_at: Date;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    created_at: Date;
    transactions: mongoose.Types.ObjectId[];
    email: string;
    password: string;
    balance: number;
    updated_at: Date;
}>> & mongoose.FlatRecord<{
    name: string;
    created_at: Date;
    transactions: mongoose.Types.ObjectId[];
    email: string;
    password: string;
    balance: number;
    updated_at: Date;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
export { Account, Transaction };
