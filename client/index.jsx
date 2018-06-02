import React from 'react'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import { BrowserRouter } from 'react-router-dom'
import green from '@material-ui/core/colors/green'
import lightGreen from '@material-ui/core/colors/lightGreen'
import { render } from 'react-dom'
import { ApolloClient, split } from 'apollo-boost'
import { getMainDefinition } from 'apollo-utilities'
import { createHttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { WebSocketLink } from 'apollo-link-ws'
import { createPersistedQueryLink } from 'apollo-link-persisted-queries'
import { ApolloProvider, graphql } from 'react-apollo'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { CachePersistor } from 'apollo-cache-persist'
import { GET_AUTH_STATUS, GET_CURRENT_USER } from './store/queries'
import { withClientState } from 'apollo-link-state'
import { defaultState as defaults } from './store/store.configuration'
import { typeDefs } from './store/type-definitions'
import {
  UpdateAuthStatus, AddUpdateResponse, resetResponseMap
} from './store/resolvers'
import App from './components/App.jsx'
import './assets/main.scss'

export const cache = new InMemoryCache()

export const stateLink = withClientState({
  cache,
  resolvers: {
    Mutation: {
      UpdateAuthStatus,
      AddUpdateResponse,
      resetResponseMap
    }
  },
  defaults,
  typeDefs
})

export const persistor = new CachePersistor({
  cache,
  storage: window.sessionStorage,
  debug: NODE_ENV !== 'production'
})
const wsLink = new WebSocketLink({
  uri: WS_HOST_NAME,
  options: {
    reconnect: true,
    connectionParams: () => ({
      authToken: Client.readQuery({ query: GET_AUTH_STATUS })
    })
  }
})
const httpLink = createHttpLink({ uri: '/graphql' })
const transportLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)
const persistedQueryLink = createPersistedQueryLink().concat(transportLink)
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

Client.onResetStore(stateLink.writeDefaults)

export const theme = createMuiTheme({
  palette: { primary: { main: '#008751' }, secondary: green },
  status: { danger: lightGreen }
})

const Vote = graphql(GET_AUTH_STATUS, {
  props: ({ data: { Auth: { _id: creatorId } } }) => ({ creatorId })
})(graphql(GET_CURRENT_USER, {
  props: ({ data: { UserFindById: user, error, loading } }) => ({
    loading, error, user, persistor
  }),
  options: props => {
    const { creatorId } = props

    return {
      variables: { _id: creatorId },
      fetchPolicy: creatorId === 'guest' ? 'cache-only' : 'cache-and-network'
    }
  }
})(App))

const WeVote = () => (<BrowserRouter>
  <MuiThemeProvider theme={theme}>
    <ApolloProvider client={Client}>
      <Vote />
    </ApolloProvider>
  </MuiThemeProvider>
</BrowserRouter>)

persistor.restore()
  .then((per) => render(<WeVote />, document.getElementById('vote')))
