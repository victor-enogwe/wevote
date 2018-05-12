import gql from 'graphql-tag'

export const ADD_UPDATE_RESPONSE = gql`
  mutation AddUpdateResponse ($record: Response!) {
    AddUpdateResponse(record: $record) @client
  }
`
export const UPDATE_AUTH_STATUS = gql`
  mutation UpdateAuthStatus ($token: String!, $_id: String!) {
    UpdateAuthStatus(token: $token, _id: $_id) @client
  }
`
export const UPDATE_USER_PROFILE = gql`
  mutation UserUpdateById ($record: UpdateByIdUserInput!) {
    UserUpdateById(record: $record) {
      record {
        _id
        displayName
        phone
        emails {
          value
        }
        photos {
          value
        },
        address {
          street
          city
          state
          country
          zip
        }
      }
    }
  }
`
