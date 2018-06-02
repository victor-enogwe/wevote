import gql from 'graphql-tag'

export const GET_NEW_MESSAGES = gql`
  subscription NewNotification {
    NewNotification {
      title
      message
      createdAt
    }
  }
`
