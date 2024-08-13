# GraphQL Queries

## Account By Id
```graphql
query {
  account(_id: "66bb6a139755ad585854286d") {
    _id
    name
    email
    password
    balance
    created_at
    updated_at
    transactions {
      _id
      source_account_id
      destination_account_id
      amount
      description
      type
      created_at
    }
  }
}
```

## All Accounts
```graphql
query {
  accounts {
    _id
    name
    email
    password
    balance
    created_at
    updated_at
    transactions {
      _id
      source_account_id
      destination_account_id
      amount
      description
      type
      created_at
    }
  }
}
```

## All Transactions
```graphql
query {
  all_transactions {
    _id
    source_account_id
    destination_account_id
    amount
    description
    type
    created_at
  }
}
```
