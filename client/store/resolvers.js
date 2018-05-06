export function updateAuthStatus (_, { token, _id }, { cache }) {
  const data = {
    user: {
      __typename: 'User',
      token,
      _id
    }
  }

  cache.writeData({ data })

  return data
}

export function updateAppErrorStatus (_, { error, message, statusCode }, { cache }) {
  const data = {
    error: {
      __typename: 'AppError',
      error,
      message,
      statusCode
    }
  }

  cache.writeData({ data })

  return data
}

export function omitTypeName (record) {
  return JSON.parse(JSON.stringify(record), (key, value) => {
    return key === '__typename' || value === null ? undefined : value
  })
}
