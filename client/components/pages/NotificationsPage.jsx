import React, { Component } from 'react'
import { compose, graphql, withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import Grid from 'material-ui/Grid'
import PropTypes from 'prop-types'
import Loader from 'react-loader-advanced'
import { withStyles } from 'material-ui/styles'
import classNames from 'classnames'
import Drawer from 'material-ui/Drawer'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import List from 'material-ui/List'
import MenuIcon from 'material-ui-icons/Menu'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'
import ListItem from 'material-ui/List/ListItem'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import ChevronRightIcon from 'material-ui-icons/ChevronRight'
import ListItemIcon from 'material-ui/List/ListItemIcon'
import ListItemText from 'material-ui/List/ListItemText'
import InboxIcon from 'material-ui-icons/MoveToInbox'
import SendIcon from 'material-ui-icons/Send'
import MailIcon from 'material-ui-icons/Mail'
import { notificationsPagesStyles } from '../../data/styles'
import { GET_NEW_MESSAGES } from '../../store/subscriptions'
import { GET_NOTIFICATIONS } from '../../store/queries'

export const mailFolderListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <InboxIcon />
      </ListItemIcon>
      <ListItemText primary='New Notices' />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <MailIcon />
      </ListItemIcon>
      <ListItemText primary='Old Notices' />
    </ListItem>
  </div>
)

export const otherMailFolderListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <SendIcon />
      </ListItemIcon>
      <ListItemText primary='Send Notice' />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <SendIcon />
      </ListItemIcon>
      <ListItemText primary='Settings' />
    </ListItem>
  </div>
)

class NotificationsPage extends Component {
  state = { open: true, newNotifications: [] }
  static propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
  }

  componentDidUpdate () {
    console.log('yaaay')
    const { notification } = this.props
    if (notification && !this.state.newNotifications.includes(notification)) {
      this.setState(state => ({
        ...state, newNotifications: [ ...state.newNotifications, notification ]
      }))
    }
  }

  toggleDrawer = () => this.setState(state => ({ ...state, open: !state.open }))

  render () {
    const { classes, theme } = this.props
    const { open, newNotifications } = this.state
    const drawer = (
      <Drawer
        variant='persistent'
        anchor='left'
        open={open}
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
        <List>{mailFolderListItems}</List>
        <Divider />
        <List>{otherMailFolderListItems}</List>
      </Drawer>
    )
    console.log(newNotifications)

    return <Grid container className={classes.grid}>
      <Grid item xs={12}>
        <div className={classes.root}>
          <div className={classes.appFrame}>
            <AppBar
              className={classNames(classes.appBar, {
                [classes.appBarShift]: open,
                [classes['appBarShift-left']]: open
              })}
            >
              <Toolbar disableGutters={!open}>
                <IconButton
                  color='inherit'
                  aria-label='open drawer'
                  onClick={this.toggleDrawer}
                  className={classNames(classes.menuButton, open && classes.hide)}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant='title' color='inherit' noWrap>
                  Notifications
                </Typography>
              </Toolbar>
            </AppBar>
            {drawer}
            <main
              className={classNames(classes.content, classes['content-left'], {
                [classes.contentShift]: open,
                [classes['contentShift-left']]: open
              })}
            >
              <div className={classes.drawerHeader} />
              <Typography>{'You think water moves fast? You should see ice.'}</Typography>
            </main>
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
      data: { NotificationConnection: notifications, error, loading, fetchMore }
    }) => ({ loading, error, notifications, fetchMore }),
    options: {
      variables: { sort: '_ID_DESC' }
    },
    skip: props => props.creatorId === 'guest'
  }),
  withStyles(notificationsPagesStyles, { withTheme: true }),
  withRouter
)(NotificationsContainer)
