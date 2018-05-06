import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import withStyles from 'material-ui/styles/withStyles'
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation'
import BookIcon from 'material-ui-icons/LibraryBooks'
import AccountCircle from 'material-ui-icons/AccountCircle'
import TradeIcon from 'material-ui-icons/ShopTwo'

class BottomNav extends React.Component {
  routes = ['/profile', '/profile/books', '/profile/trades']
  static styles = {
    root: {
      height: '10vh'
    }
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.shape().isRequired,
    user: PropTypes.shape()
  }

  handleChange = (event, value) => this.props.history.push(this.routes[value])

  render () {
    const { classes, user, history } = this.props

    return (
      <BottomNavigation
        value={this.routes.indexOf(history.location.pathname)}
        onChange={this.handleChange}
        showLabels
        className={classes.root}
      >
        {user ? <BottomNavigationAction label='Profile' icon={<AccountCircle />} /> : null}
        {user ? <BottomNavigationAction label='My Books' icon={<BookIcon />} /> : null}
        {user ? <BottomNavigationAction label='Requests' icon={<TradeIcon />} /> : null}
      </BottomNavigation>
    )
  }
}

export default withRouter(withStyles(BottomNav.styles)(BottomNav))
