import React, { Component } from 'react'
import { compose, graphql, withApollo } from 'react-apollo'
import { Route, Switch, withRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import Loader from 'react-loader-advanced'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import MenuIcon from '@material-ui/icons/Menu'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import SendIcon from '@material-ui/icons/Send'
import { notificationsPagesStyles } from '../../data/styles'
import { GET_NEW_MESSAGES } from '../../store/subscriptions'
import { GET_NOTIFICATIONS } from '../../store/queries'
import NotificationSettings from './notifications/NotificationSettings'
import Notifications from './notifications/Notifications'

export const mainMenuItems = history => (
  <div>
    <ListItem button onClick={() => history.push('/notifications')}>
      <ListItemIcon>
        <InboxIcon />
      </ListItemIcon>
      <ListItemText primary='Inbox' />
    </ListItem>
  </div>
)

export const subMenuItems = (history, role) => (
  <div>
    {role !== 'ADMIN' ? null : <ListItem
      button onClick={() => history.push('/notifications/send')}
    >
      <ListItemIcon>
        <SendIcon />
      </ListItemIcon>
      <ListItemText primary='Send Notice' />
    </ListItem>}
    <ListItem button onClick={() => history.push('/notifications/settings')}>
      <ListItemIcon>
        <SendIcon />
      </ListItemIcon>
      <ListItemText primary='Settings' />
    </ListItem>
  </div>
)

class NotificationsPage extends Component {
  state = { open: true }
  beep = React.createRef()
  static propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    creatorId: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired
  }

  componentDidUpdate () {
    const { notification } = this.props
    if (notification) {
      this.beep.current.play()
      this.props.refetch()
    }
  }

  toggleDrawer = () => this.setState(state => ({ ...state, open: !state.open }))

  render () {
    const { classes, theme, history, notifications, role } = this.props
    const drawer = (
      <Drawer
        variant='persistent'
        anchor='left'
        open={this.state.open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.toggleDrawer}>
            {theme.direction === 'rtl'
              ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>{mainMenuItems(history)}</List>
        <Divider />
        <List>{subMenuItems(history, role)}</List>
      </Drawer>
    )

    return <Grid container className={classes.grid}>
      <Grid item xs={12}>
        <div className={classes.root}>
          <div className={classes.appFrame}>
            <AppBar
              className={classNames(classes.appBar, {
                [classes.appBarShift]: this.state.open,
                [classes['appBarShift-left']]: this.state.open
              })}
            >
              <Toolbar disableGutters={!this.state.open}>
                <IconButton
                  color='inherit'
                  aria-label='open drawer'
                  onClick={this.toggleDrawer}
                  className={
                    classNames(
                      classes.menuButton, this.state.open && classes.hide
                    )
                  }
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant='title' color='inherit' noWrap>
                  Notifications
                </Typography>
              </Toolbar>
            </AppBar>
            {drawer}
            <Grid
              container
              alignContent='flex-start'
              justify='flex-start'
              className={classNames(classes.content, classes['content-left'], {
                [classes.contentShift]: this.state.open,
                [classes['contentShift-left']]: this.state.open
              })}
            >
              <Grid item xs={12} className={classes.drawerHeader} />
              <Switch>
                <Route exact path='/notifications' render={
                  () => <Notifications
                    notifications={notifications}
                  />
                } />
                <Route exact path='/notifications/settings' render={
                  () => <NotificationSettings notifications={notifications} />
                } />
              </Switch>
            </Grid>
            <audio ref={this.beep} src='../../assets/new-message.mp3' />
          </div>
        </div>
      </Grid>
    </Grid>
  }
}

const NotificationsContainer = (props) => (
  <Loader show={props.loading || false} message='please wait'>
    {!props.loading ? <NotificationsPage {...props} /> : null}
  </Loader>
)

export default compose(
  withApollo,
  graphql(GET_NEW_MESSAGES, {
    props: ({
      data: { NewNotification: notification, error: newNoticeError }
    }) => ({ newNoticeError, notification })
  }),
  graphql(GET_NOTIFICATIONS, {
    props: ({
      data: {
        NotificationConnection: notifications,
        error,
        loading,
        fetchMore,
        refetch
      }
    }) => ({ loading, error, notifications, fetchMore, refetch }),
    options: {
      variables: { sort: '_ID_DESC' }
    },
    skip: props => props.creatorId === 'guest'
  }),
  withStyles(notificationsPagesStyles, { withTheme: true }),
  withRouter
)(NotificationsContainer)
