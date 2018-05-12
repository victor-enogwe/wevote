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
      inputType
      options {
        title
        nextQuestionId
      }
      nextQuestionId
      score
      externalData
      subQuestions {
        question
        inputType
        options {
          title
        }
        score
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
