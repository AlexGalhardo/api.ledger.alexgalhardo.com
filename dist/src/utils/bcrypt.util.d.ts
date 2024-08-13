export declare class Bcrypt {
    static hash(password: string): Promise<string>;
    static compare(password: string, hashPassword: string): Promise<boolean>;
}
