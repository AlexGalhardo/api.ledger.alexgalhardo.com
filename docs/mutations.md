# GraphQL Mutations

## Create Account
```graphql
mutation {
	createAccount(
		owner_name: "New Account",
		owner_email: "newaccount@example.com",
		balance: 0)
	{
		account_id
		owner_name
		owner_email
		balance
		created_at
		updated_at
	}
}
```

## Deposit Money
```graphql
mutation {
  createTransaction(
    source_account_id: "default-account-id",
    amount: 500,
    description: "Deposit",
    type: DEPOSIT)
  {
    source_account_id
    amount
    description
    type
  }
}
```
