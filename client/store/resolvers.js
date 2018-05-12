import { GET_CURRENT_USER } from './queries'
import { persistor } from '../index'

function updateResponse (responseMap, record) {
  const index = responseMap
    .findIndex(value => value.questionId === record.questionId)

  index !== -1 ? (responseMap[index] = record) : responseMap.push(record)

  return responseMap
}

export function UpdateAuthStatus (_, { token, _id }, { cache }) {
  const data = {
    Auth: {
      __typename: 'Auth',
      token,
      _id
    }
  }

  cache.writeData({ data })

  return data
}

export async function AddUpdateResponse (_, { record }, { cache }) {
  record = {
    ...record,
    subResponses: record.subResponses ? record.subResponses.map(response => ({
      ...response, __typename: 'ResponseSubResponses'
    })) : [],
    __typename: 'Response'
  }
  const query = cache.readQuery({
    query: GET_CURRENT_USER, variables: { _id: record.creatorId }
  })
  const { UserFindById, UserFindById: { responseMap } } = query
  const data = {
    ...query,
    UserFindById: {
      ...UserFindById, responseMap: updateResponse(responseMap, record)
    }
  }

  cache.writeQuery({
    query: GET_CURRENT_USER, variables: { _id: record.creatorId }, data
  })

  return data
}

export function omitTypeName (record) {
  return JSON.parse(JSON.stringify(record), (key, value) => {
    return key === '__typename' || value === null ? undefined : value
  })
}
