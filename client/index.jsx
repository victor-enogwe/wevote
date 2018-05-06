import React from 'react'
import { render } from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import createMuiTheme from 'material-ui/styles/createMuiTheme'
import { darkBaseTheme } from 'material-ui/styles'
import { ApolloClient } from 'apollo-boost'
import { createHttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloProvider } from 'react-apollo'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { CachePersistor } from 'apollo-cache-persist'
import { withClientState } from 'apollo-link-state'
import { BrowserRouter } from 'react-router-dom'
import App from './components/App.jsx'
import './assets/main.scss'
import { defaultState as defaults } from './store/store.configuration'
import { GET_AUTH_STATUS, GET_APP_ERROR_STATUS } from './store/queries'
import { typeDefs } from './store/type-definitions'
import Snackbar from 'material-ui/Snackbar'
import PropTypes from 'prop-types'
import { updateAuthStatus, updateAppErrorStatus } from './store/resolvers'

const Snack = (props) => (<Snackbar
  open={props.open}
  autoHideDuration={props.duration || 2000}
  message={props.message}
  onClose={props.onExit}
/>)

Snack.propTypes = {
  open: PropTypes.bool.isRequired,
  autoHideDuration: PropTypes.number,
  message: PropTypes.string.isRequired,
  onExit: PropTypes.func
}

export const cache = new InMemoryCache()

export const persistor = new CachePersistor({
  cache,
  storage: window.sessionStorage,
  debug: NODE_ENV !== 'production'
})
const stateLink = withClientState({
  cache,
  resolvers: {
    Mutation: {
      updateAuthStatus,
      updateAppErrorStatus
    }
  },
  defaults,
  typeDefs
})
const logoutLink = onError(async ({ networkError }) => {
  const { statusCode = 500 } = networkError || {
    statusCode: 500, message: 'Oops! something went wrong. try again.'
  }

  const netError = statusCode === 401 ? 'Your Login Session has Expired' : null
  const errorMessage = netError

  await cache.writeQuery({
    query: GET_APP_ERROR_STATUS,
    data: { error: {
      error: true,
      message: errorMessage || 'Oops! something went wrong. try again.',
      statusCode,
      __typename: 'AppError'
    } }
  })
})
const httpLink = logoutLink.concat(createHttpLink({ uri: '/graphql' }))
const contextLink = setContext(async (_, { headers = {} }) => {
  const { user: { token } } = Client.readQuery({ query: GET_AUTH_STATUS })
  if (token) {
    headers.authorization = token
  }
  return ({ headers })
}).concat(httpLink)
const link = stateLink.concat(contextLink)

export const Client = new ApolloClient({ cache, link })

Client.onResetStore(stateLink.writeDefaults)

const Library = (props) => (
  <BrowserRouter>
    <MuiThemeProvider theme={props.theme}>
      <ApolloProvider client={props.client}>
        <App client={props.client} persistor={persistor} />
      </ApolloProvider>
    </MuiThemeProvider>
  </BrowserRouter>
)
persistor.restore().then(() => render(<Library
  theme={createMuiTheme(darkBaseTheme)}
  client={Client}
  persistor={persistor}
/>, document.getElementById('vote')))

module.exports.Snack = Snack
export default App
