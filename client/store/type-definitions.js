export const typeDefs = `
  type user {
    token: String!
    _id: String!
  }
  type error {
    error: Boolean!
    message String!
    statusCode: Number!
  }
  type Mutation {
    updateAuthStatus(token: String!, _id: String!): user
    updateAppErrorStatus(error: Boolean!, message: String!, statusCode: Number!): error
  }
  type Query {
    title: String!
    user: user!
    error: error!
  }
`
