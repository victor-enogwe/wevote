import gql from 'graphql-tag'

export const GET_APP_ERROR_STATUS = gql`
  query {
    error @client {
      error
      message
      statusCode
    }
  }
`

export const UPDATE_APP_ERROR_STATUS = gql`
  mutation ($error: Boolean!, $message: String!, $statusCode: Number!) {
    updateAppErrorStatus (error: $error, message: $message, statusCode: $statusCode ) @client
  }
`

export const GET_AUTH_STATUS = gql`
  query {
    user @client {
      token
      _id
    }
  }
`

export const UPDATE_AUTH_STATUS = gql`
  mutation ($token: String!, $_id: String!) {
    updateAuthStatus(token: $token, _id: $_id) @client
  }
`

export const UPDATE_USER_PROFILE = gql`
  mutation ($record: UpdateByIdUserInput!) {
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

export const GET_USER = gql`
  query ($_id: MongoID!) {
    UserFindById(_id: $_id) {
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
`

export const GET_USER_IN_CLIENT = gql`
  query {
    user  @client
  }
`

export const GET_ONE_BOOK = gql`
  query ($filter: FilterFindOneBookInput) {
    BookFindOne(filter: $filter) {
      title
      _id
      title
      description
      image
      author
      creatorId
      status
      createdAt
      lendingDetails {
        amount
        currency
        info
        duration
        status
        loanedTo
      }
    }
  }
`

export const GET_BOOK_BY_ID = gql`
  query ($_id: MongoID!) {
    BookFindById(_id: $_id) {
      title
      _id
      title
      description
      image
      author
      creatorId
      status
      createdAt
      creator {
        _id
        displayName,
        photos {
          value
        }
      }
      lendingDetails {
        amount
        currency
        info
        duration
        status
        loanedTo
      }
    }
  }
`

export const GET_MANY_BOOKS = gql`
  query($page: Int, $limit: Int, $filter: FilterFindManyBookInput, $sort: SortFindManyBookInput) {
    BookPagination(page: $page, perPage: $limit, filter: $filter, sort: $sort) {
      count
      items {
        title
        _id
        title
        description
        image
        author
        creatorId
        status
        createdAt
        lendingDetails {
          amount
          currency
          info
          duration
          status
          loanedTo
        }
      }
    }
  }
`

export const CREATE_BOOK = gql`
  mutation ($record: CreateOneBookInput!) {
    BookCreateOne(record: $record) {
      recordId
      record {
        title
        _id
        title
        description
        image
        author
        creatorId
        status
        lendingDetails {
          amount
          currency
          info
          duration
          status
          loanedTo
        }
        createdAt
      }
    }
  }
`

export const EDIT_BOOK = gql`
  mutation ($book: UpdateByIdBookInput!) {
    BookUpdateById(record: $book) {
      recordId
      record {
        title
        _id
        title
        description
        image
        author
        creatorId
        status
        createdAt
        lendingDetails {
          amount
          currency
          info
          duration
          status
          loanedTo
        }
      }
    }
  }
`

export const REMOVE_BOOK = gql`
  mutation ($_id: MongoID!) {
    BookRemoveById(_id: $_id) {
      recordId
      record {
        title
      }
    }
  }
`
export const GET_REQUESTS = gql`
  query ($page: Int, $limit: Int, $filter: FilterFindManyRequestInput, $sort: SortFindManyRequestInput) {
    RequestPagination (page: $page, perPage: $limit, filter: $filter, sort: $sort) {
      count
      items {
        _id
        creatorId
        bookId
        bookDetails {
          title
          status
          lendingDetails {
            loanedTo
            status
          }
        }
        creatorDetails {
          _id
          displayName
          emails {
            value
          }
          photos {
            value
          }
          phone
        }
        createdAt
      }
    }
  }
`

export const CREATE_REQUEST = gql`
  mutation ($record: CreateOneRequestInput!) {
    RequestCreateOne (record: $record) {
      record {
        _id
        bookId
        creatorId
      }
    }
  }
`

export const GET_ONE_REQUEST = gql`
  query ($filter: FilterFindOneRequestInput) {
    RequestFindOne(filter: $filter) {
      _id
    }
  }
`

export const DELETE_REQUEST_BY_ID = gql`
  mutation ($_id: MongoID!) {
    RequestRemoveById(_id: $_id) {
      recordId
    }
  }
`
