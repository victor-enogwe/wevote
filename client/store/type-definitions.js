export const typeDefs = `
  type Auth {
    token: String!
    _id: String!
  }

  type UserEmails {
    _id: String!
    value: String!
  }

  type UserPhotos {
    _id: String!
    value: String!
  }

  type UserAddress {
    street: String!
    city: String!,
    state: String!
  }

  type ResponseSubResponses {
    question: String!
    answer: String!
  }

  type Response {
    questionId: Number!
    creatorId: String!
    answer: String
    subResponses: [ResponseSubResponses]
  }

  type User {
    _id: String
    displayName: String
    phone: String
    emails: [UserEmails]
    photos: [UserPhotos]
    address: [UserAddress],
    vriTaken: Boolean!
    responseMap: [Response]
  }

  type Mutation {
    UpdateAuthStatus(token: String!, _id: String!): Auth
    AddUpdateResponse(record: Response)
  }

  type Query {
    Auth: Auth
    UserFindById(_id: String!): User
  }
`
