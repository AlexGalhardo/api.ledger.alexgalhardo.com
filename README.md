<div align="center">
	<h1 align="center"><a href="https://api.ledger.alexgalhardo.com/" target="_blank">api.ledger.alexgalhardo.com</a></h1>
</div>

https://github.com/user-attachments/assets/de0b0060-bb91-4726-9782-6ea8b49692da

## Introduction

- Coding challenge to create a simple Banking Ledger

## Technologies
- [NodeJS](https://nodejs.org/en)
- [KoaJS](https://koajs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Moongoose ODM](https://mongoosejs.com/)
- [GraphQL](https://graphql.org/)

## How to improve
- [ ] Add PM2 process manager
- [ ] Finish JWT Middleware Authentication to make transactions and queries
- [ ] Create integrations tests and tests for graphql queries
- [ ] Use database transactions and deal with concurrency properly (A.C.I.D operations)

## Development Setup Local

1. Clone repository
```bash
git clone git@github.com:AlexGalhardo/api.ledger.alexgalhardo.com.git
```

2. Enter repository
```bash
cd api.ledger.alexgalhardo.com/
```

3. Create .env, install dependencies, up docker and server
```bash
chmod +x setup.sh && ./setup.sh
```

## API Requests

- You can see the HTTP Requests references inside folder [rest-client/](rest-client/)
- You can also see GraphQL Client on:
   - Localhost: <http://localhost:3000/graphql>
   - Live: <https://api.ledger.alexgalhardo.com/graphql>

## Documentation
- Read and add usefull documentation (markdown, notes, images, best practices, etc) about this project inside folder [docs/](docs/)

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) August 2024-present, [Alex Galhardo](https://github.com/AlexGalhardo)
