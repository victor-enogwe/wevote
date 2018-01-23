[![Dependency Status](https://david-dm.org/wevote-api/wevote-api-node/status.svg)](https://david-dm.org/wevote-api/wevote-api-node/)
[![devDependency Status](https://david-dm.org/wevote-api/wevote-api-node/dev-status.svg)](https://david-dm.org/wevote-api/wevote-api-node/#info=devDependencies)

# wevote-api
A CITIZENS MOBILISATION PLATFORM FOR THE 2019 ELECTIONS.

## Getting Started
- Make sure you have _`nodeJs`_ and _`postgres`_ installed
- Create a database in postgres
- Make a copy of the `env.example` file and rename it to `.env`
- update the `DATABASE_URL` to mirror your database credentails 
- Run `npm db:prepare`
- Run `npm run build` - only required in production.
- Run `npm run start:dev` for development and `npm start` for production.

