import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { withApollo } from 'react-apollo'
import { stateLink } from '../index'
import Loader from 'react-loader-advanced'
import Nav from './Nav'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import QuestionsPage from './pages/QuestionsPage'
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
    await this.props.client.cache.reset()
    await stateLink.writeDefaults()
    this.props.setAuthState({ _id: 'guest', skipUserQuery: true })
  }

  render () {
    let { loading, user, error, setAuthState, fetchUser, classes } = this.props

    return <Loader show={loading} message='please wait'>
      <Nav
        title='WE-VOTE'
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
              {...routerProps} {...this.props}
            />}
          />
          <Route component={FourZeroFourPage} />
        </Switch>
        <Snack
          open={error !== undefined}
          message={'User not found! You need to login again.'}
        />
      </div>
      <BottomNav user={user} />
    </Loader>
  }
}

export default withApollo(withStyles(appStyles)(withRouter(App)))
