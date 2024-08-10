<div align="center">
	<h1 align="center"><a href="https://api.ledger.alexgalhardo.com/" target="_blank">api.ledger.alexgalhardo.com</a></h1>
</div>

## Introduction

- Coding challenge to create a simple Banking Ledger

## Technologies
- [NodeJS](https://nodejs.org/en)
- [KoaJS](https://koajs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Moongoose ODM](https://mongoosejs.com/)
- [GraphQL](https://graphql.org/)

## Development Setup Local

1. Clone repository
```bash
git clone git@github.com:AlexGalhardo/api.ledger.alexgalhardo.com.git
```

2. Enter repository
```bash
cd api.ledger.alexgalhardo.com/
```

3. Install dependencies
```bash
npm install
```

4. Setup your environment variables
```bash
cp .env.example .env
```

5. Create Migrations and Seeds
```bash
chmod +x setup.sh && ./setup.sh
```

7. Start local server
```bash
npm run dev
```

## API Requests

- You can see the HTTP Requests references inside folder **rest-client/**
- You can also see GraphQL Client in: <http://localhost:3000/graphql>

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) August 2024-present, [Alex Galhardo](https://github.com/AlexGalhardo)
