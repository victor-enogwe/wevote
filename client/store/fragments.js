import gql from 'graphql-tag'

export const USER_RESPONSE_FRAGMENT = gql`
  fragment responseMap on  User {
    responseMap {
      creatorId
      questionId
      answer
      subResponses
    }
  }
`
