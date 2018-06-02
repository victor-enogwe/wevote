export const defaultState = {
  Auth: {
    token: null,
    _id: 'guest',
    __typename: 'Auth'
  },
  [`UserFindById({"_id":"guest"})`]: {
    _id: 'guest',
    displayName: null,
    phone: null,
    emails: null,
    photos: null,
    address: null,
    vriTaken: false,
    roleDetails: {
      title: 'guest',
      __typename: 'Role'
    },
    responseMap: [],
    __typename: 'User'
  }
}
