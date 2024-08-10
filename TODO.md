### Challenge Stack
- Backend: MongoDB, NodeJS, Koajs, GraphQL
- Frontend: React, Relay
- Tests: Jest

### Theme - Bank
The theme of the challenge is to create a simple replica of a bank in which it is possible:
- Send a transaction
- Receive a transaction
- Calculate the available balance of an account

#### Backend
The backend must be a GraphQL API that handles all the required items above.

Stack: NodeJs, KoaJs, MongoDB, GraphQL

Plus (optional): Use Node and Connection from Relay to handle get collection and lists.

#### Collections
It must be able to transact between two accounts. 
- Account
- Transaction

#### Deploy
The backend must be deployed where it can be accessible.

#### Plus
- Expose a GraphQL Playground
- Generate a postman JSON to be able to import and make calls to the Backend GraphQL API
- It uses graphql-HTTP
- It has a test with Jest or a Test Runner of choice

### Frontend
- It must be able to create an account in an easier way, could have default accounts
- It must have an action button to transfer money between accounts
- It must use Shadcn
- It must use Vite with React Router
- It must use [Relay](relay.dev)

#### Deploy
The front end must be deployed where it can be accessible in production to be reviewed by our team.

#### Plus
- Use Shadcn
- Use vite with React Router latest version
- Create a storybook of your UI components
- Create a dash such as a real bank
- It has tested with Jest or a Test Runner of choice
