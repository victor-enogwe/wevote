import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { ApolloClient } from 'apollo-boost'
import { CachePersistor } from 'apollo-cache-persist'
import { Query } from 'react-apollo'
import Loader from 'react-loader-advanced'
import {
  GET_USER, GET_AUTH_STATUS, GET_APP_ERROR_STATUS, GET_USER_IN_CLIENT
} from '../store/queries'
import Nav from './Nav'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import BooksPage from './pages/BooksPage'
import UserBooksPage from './pages/UserBooksPage'
import ProfilePage from './pages/ProfilePage'
import RequestsPage from './pages/RequestsPage'
import EditBookPage from './pages/EditBookPage'
import BookPage from './pages/BookPage'
import FourZeroFourPage from './pages/FourZeroFourPage'
import { Snack } from '../index'

export default withRouter(class App extends Component {
  static propTypes = {
    client: PropTypes.instanceOf(ApolloClient).isRequired,
    persistor: PropTypes.instanceOf(CachePersistor).isRequired
  }

  logout = () => this.props.client.resetStore()
    .then(() => this.props.persistor.purge())
    .then(() => this.setState({
      user: null,
      loading: false,
      auth: false
    }))
    .then(() => (window.location.href = '/'))

  clearAppError = (statusCode) => {
    this.props.client.cache.writeQuery({
      query: GET_APP_ERROR_STATUS,
      data: { error: {
        error: false,
        message: '',
        statusCode: 200,
        __typename: 'AppError'
      } }
    })

    return (statusCode === 401 ? this.logout() : null)
  }

  render () {
    return <Query
      query={GET_AUTH_STATUS}
      children={({ data: { user: { _id } }, loading: loadingAuth }) => {
        return <Query
          query={_id ? GET_USER : GET_USER_IN_CLIENT}
          variables={{ _id }}
          children={({
            data: { UserFindById: user } = { UserFindById: null },
            loading: loadingUser
          }) => {
            const auth = user ? _id === user._id : false

            return <Loader
              show={loadingAuth || loadingUser}
              message='please wait'
            >
              <Nav
                title='FCC LIB'
                pageTitle='home'
                auth={auth}
                logout={this.logout}
                user={user}
              />
              <Switch>
                <Route exact path='/' render={routerProps => <HomePage {...routerProps} />} />
                <Route
                  exact path='/login'
                  render={routerProps => <LoginPage {...routerProps} />}
                />
                <Route exact path='/books' render={(routerProps) => <BooksPage
                  {...routerProps}
                  {...this.props}
                  user={user}
                  filter={{
                    status: 'AVAILABLE'
                  }}
                  limit={8}
                  page={1}
                  sort='CREATORID__TITLE_ASC'
                />} />
                <Route exact path='/books/:id' render={(routerProps) => <BookPage
                  {...routerProps}
                  {...this.props}
                  user={user}
                />} />
                {auth ? <Route exact path='/profile' render={
                  (routerProps) => <ProfilePage {...routerProps} {...this.props} user={user} />
                } /> : null}
                {auth ? <Route exact path='/profile/books' render={
                  (routerProps) => <UserBooksPage
                    {...routerProps}
                    {...this.props}
                    user={user}
                    filter={{ creatorId: user._id }}
                    limit={8}
                    page={1}
                    sort='CREATORID__TITLE_ASC'
                  />
                } /> : null}
                {auth ? <Route exact path='/profile/trades' render={
                  (routerProps) => <RequestsPage {...routerProps} {...this.props} user={user} />
                } /> : null}
                {auth ? <Route exact path='/profile/books/:id' render={
                  (routerProps) => <EditBookPage
                    {...routerProps}
                    {...this.props}
                    user={user}
                  />
                } /> : null}
                <Route component={FourZeroFourPage} />
              </Switch>
              {_id ? <Query
                query={GET_APP_ERROR_STATUS}
                children={({ data: { error: appError } }) => {
                  return <Snack
                    anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
                    open={appError.error}
                    message={appError.message}
                    onExit={this.clearAppError.bind(null, appError.statusCode)}
                  />
                }}
              /> : null}
            </Loader>
          }}
        />
      }} />
  }
})
