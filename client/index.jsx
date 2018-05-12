import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import createMuiTheme from 'material-ui/styles/createMuiTheme'
import green from 'material-ui/colors/green'
import lightGreen from 'material-ui/colors/lightGreen'
import { render } from 'react-dom'
import { ApolloClient } from 'apollo-boost'
import { createHttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { createPersistedQueryLink } from 'apollo-link-persisted-queries'
import { ApolloProvider, graphql } from 'react-apollo'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { CachePersistor } from 'apollo-cache-persist'
import { GET_AUTH_STATUS, GET_CURRENT_USER } from './store/queries'
import { withClientState } from 'apollo-link-state'
import { BrowserRouter } from 'react-router-dom'
import { defaultState as defaults } from './store/store.configuration'
import { typeDefs } from './store/type-definitions'
import { UpdateAuthStatus, AddUpdateResponse } from './store/resolvers'
import App from './components/App.jsx'
import './assets/main.scss'

export const cache = new InMemoryCache()

export const stateLink = withClientState({
  cache,
  resolvers: {
    Mutation: {
      UpdateAuthStatus,
      AddUpdateResponse
    }
  },
  defaults,
  typeDefs
})

export const persistor = new CachePersistor({
  cache,
  storage: window.localStorage,
  debug: NODE_ENV !== 'production'
})

const httpLink = createHttpLink({ uri: '/graphql' })
const persistedQueryLink = createPersistedQueryLink().concat(httpLink)
const contextLink = setContext(async (_, { headers = {} }) => {
  const { Auth: { token } } = Client.readQuery({ query: GET_AUTH_STATUS })
  if (token) {
    headers.authorization = token
  }
  return ({ headers })
}).concat(persistedQueryLink)
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    return graphQLErrors.map(({ message, locations, path }) => ({
      graphQLError: { message, locations, path }
    }))
  }

  return networkError || graphQLErrors
})

const link = stateLink.concat(contextLink, errorLink)

export const Client = new ApolloClient({
  cache, link, connectToDevTools: NODE_ENV !== 'production'
})

const theme = createMuiTheme({
  palette: { primary: { main: '#008751' }, secondary: green },
  status: { danger: lightGreen }
})

const Vote = graphql(GET_CURRENT_USER, {
  props: ({ data: {
    UserFindById: user, error, loading, refetch: fetchUser
  } }) => ({ loading, error, user, fetchUser, persistor }),
  options: props => ({
    variables: { _id: props._id },
    fetchPolicy: props.skipUserQuery ? 'cache-only' : 'cache-and-network'
  })
})(App)

class WeVote extends React.Component {
  state = {
    _id: Client.readQuery({ query: GET_AUTH_STATUS }).Auth._id,
    skipUserQuery: true
  }

  setAuthState = state => this
    .setState(prevState => ({ ...prevState, ...state }))

  render () {
    return (
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <ApolloProvider client={Client}>
            <Vote
              {...this.props} _id={this.state._id}
              setAuthState={this.setAuthState}
              loading={false}
              skipUserQuery={this.state.skipUserQuery}
            />
          </ApolloProvider>
        </MuiThemeProvider>
      </BrowserRouter>
    )
  }
}

persistor.restore()
  .then(() => render(<WeVote />, document.getElementById('vote')))
