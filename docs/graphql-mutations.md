# GraphQL Mutations

## Create Account
```graphql
mutation {
	createAccount(
		name: "New Account",
		email: "newaccount@example.com",
		password: "qweBR!123")
	{
		_id
		name
		email
		password
		balance
		created_at
		updated_at
	}
}
```

## Create Transaction - DEPOSIT
```graphql
mutation {
  createTransaction(
    source_account_id: "66bb6ad39755ad5858542880",
    amount: 700,
    description: "Deposit",
    type: DEPOSIT)
  {
	_id
    source_account_id
    amount
    description
    type
	created_at
  }
}
```

## Create Transaction - PIX
```graphql
mutation {
  createTransaction(
    source_account_id: "a2dff015-8d12-460e-9fdf-f2149030a171",
    destination_account_id: "87cdcb78-0f0d-41e5-99f8-d1fc0579530f",
    amount: 490,
    description: "PIX",
    type: PIX)
  {
    source_account_id
    amount
    description
    type
  }
}
```
