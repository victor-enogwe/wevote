import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { withApollo } from 'react-apollo'
import Loader from 'react-loader-advanced'
import Nav from './Nav'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import QuestionsPage from './pages/QuestionsPage'
import NotificationsPage from './pages/NotificationsPage'
import FourZeroFourPage from './pages/FourZeroFourPage'
import BottomNav from './BottomNav'
import Snack from './Snack'
import { appStyles } from '../data/styles'

class App extends Component {
  static propTypes = {
    user: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object
  }

  async logout (redirect, path = '/') {
    if (redirect) this.props.history.replace(path)
    await this.props.client.resetStore()
    this.props.setAuthState({ creatorId: 'guest', skipUserQuery: true })
  }

  render () {
    let {
      loading, user, error, setAuthState, fetchUser, classes, creatorId
    } = this.props

    return <Loader show={loading} message='please wait'>
      <Nav
        title='WEVOTE'
        pageTitle='home'
        logout={this.logout.bind(this)}
        user={user}
      />
      <div className={classes.page}>
        <Switch>
          <Route
            exact path='/' render={routerProps => <HomePage {...routerProps} />}
          />
          <Route
            exact path='/login'
            render={routerProps => <LoginPage
              {...routerProps} setAuthState={setAuthState} fetcUser={fetchUser}
            />}
          />

          <Route
            exact path='/vri'
            render={routerProps => <QuestionsPage
              {...routerProps} user={user} creatorId={creatorId}
            />}
          />

          {creatorId === 'guest' ? null : <Route
            exact path='/notifications'
            render={routerProps => <NotificationsPage
              {...routerProps} creatorId={creatorId}
            />}
          />}

          <Route component={FourZeroFourPage} />
        </Switch>
        <Snack
          open={error !== undefined}
          message={'User not found! You need to login again.'}
        />
      </div>
      <BottomNav creatorId={creatorId} />
    </Loader>
  }
}

export default withApollo(withStyles(appStyles)(withRouter(App)))
