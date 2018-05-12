import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Drawer from 'material-ui/Drawer'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import InboxIcon from 'material-ui-icons/MoveToInbox'
import DraftsIcon from 'material-ui-icons/Drafts'
import StarIcon from 'material-ui-icons/Star'
import SendIcon from 'material-ui-icons/Send'
import MailIcon from 'material-ui-icons/Mail'
import DeleteIcon from 'material-ui-icons/Delete'
import ReportIcon from 'material-ui-icons/Report'

export const mailFolderListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <InboxIcon />
      </ListItemIcon>
      <ListItemText primary='Inbox' />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <StarIcon />
      </ListItemIcon>
      <ListItemText primary='Starred' />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <SendIcon />
      </ListItemIcon>
      <ListItemText primary='Send mail' />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <DraftsIcon />
      </ListItemIcon>
      <ListItemText primary='Drafts' />
    </ListItem>
  </div>
)

export const otherMailFolderListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <MailIcon />
      </ListItemIcon>
      <ListItemText primary='All mail' />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      <ListItemText primary='Trash' />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ReportIcon />
      </ListItemIcon>
      <ListItemText primary='Spam' />
    </ListItem>
  </div>
)
const drawerWidth = '30vw'

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    width: drawerWidth
  },
  toolbar: theme.mixins.toolbar
})

function Recommendations (props) {
  const { classes } = props

  return (
    <Drawer
      variant='permanent'
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.toolbar} />
      <List>{mailFolderListItems}</List>
      <Divider />
      <List>{otherMailFolderListItems}</List>
    </Drawer>
  )
}

Recommendations.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Recommendations)
