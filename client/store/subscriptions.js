import gql from 'graphql-tag'

export const GET_NEW_MESSAGES = gql`
  subscription NewNotification {
    NewNotification {
      _id
      title
      message
      createdAt
    }
  }
`
