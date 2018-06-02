import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
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
    creatorId: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object
  }

  render () {
    const { loading, user, error, classes, logout, creatorId } = this.props
    const { title: role } = user.roleDetails

    return <Loader show={loading} message='please wait'>
      <Nav title='WEVOTE' pageTitle='home' logout={logout} user={user} />
      <div className={classes.page}>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/login' component={LoginPage} />

          <Route
            exact path='/vri'
            render={() => <QuestionsPage user={user} creatorId={creatorId} />}
          />

          {creatorId === 'guest' ? null : <Route
            path='/notifications'
            render={() => <NotificationsPage
              creatorId={creatorId}
              role={role}
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
