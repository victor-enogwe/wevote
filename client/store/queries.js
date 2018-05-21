import gql from 'graphql-tag'

export const GET_AUTH_STATUS = gql`
  query Auth {
    Auth @client {
      token
      _id
    }
  }
`

export const GET_CURRENT_USER = gql`
  query UserFindById ($_id: MongoID!) {
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
      }
      vriTaken
      roleDetails {
        title
      }
      responseMap {
        creatorId
        questionId
        answer
        subResponses {
          question
          answer
        }
      }
    }
  }
`
export const GET_QUESTIONS = gql`
  query QuestionFindMany {
    QuestionFindMany (sort: QUESTIONID_ASC) {
      questionId
      question
      recommendation
      label
      inputType
      options {
        title
        nextQuestionId
        score
        recommendation
      }
      nextQuestionId
      externalData
      subQuestions {
        question
        label
        recommendation
        inputType
        options {
          recommendation
          title
          score
        }
        externalData
      }
    }
  }
`

export const GET_USER_RESPONSE_MAP = gql`
  query ResponseFindMany ($filter: FilterFindManyResponseInput) {
    ResponseFindMany(filter: $filter) {
      creatorId
      questionId
      question
      answer
      subResponses {
        question
        answer
      }
    }
  }
`
export const GET_NOTIFICATIONS = gql`
  query ($sort: SortConnectionNotificationEnum) {
    NotificationConnection(first: 1, sort: $sort, last: 1, after: "opaqueCursor") {
      count
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          title
          message
          createdAt
        }
      }
    }
  }
`
