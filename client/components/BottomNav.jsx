import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import BookIcon from '@material-ui/icons/LibraryBooks'
import AccountCircle from '@material-ui/icons/AccountCircle'
import TradeIcon from '@material-ui/icons/ShopTwo'
// import GTranslate from '@material-ui/icons/GTranslate'

class BottomNav extends React.Component {
  routes = ['elect', '/elections', '/notifications', '/social']
  static styles = {
    root: {
      height: '10vh'
    }
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.shape().isRequired,
    creatorId: PropTypes.string.isRequired
  }

  handleChange = (event, value) => {
    if (value === 'language') {
      return null
    }
    return this.props.history.push(value)
  }

  render () {
    const { classes, history, creatorId } = this.props

    return (
      <BottomNavigation
        value={history.location.pathname.replace('/', '')}
        onChange={this.handleChange}
        showLabels
        className={classes.root}
      >
        {/* <BottomNavigationAction
          value='language' label='Language' icon={<GTranslate />}
        /> */}
        <BottomNavigationAction
          value='elections' label='Elections' icon={<AccountCircle />}
        />
        {creatorId === 'guest' ? null : <BottomNavigationAction
          value='notifications' label='Notifications' icon={<BookIcon />}
        />}
        <BottomNavigationAction
          value='social' label='Social' icon={<TradeIcon />}
        />
      </BottomNavigation>
    )
  }
}

export default withRouter(withStyles(BottomNav.styles)(BottomNav))
