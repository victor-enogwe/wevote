import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { notificationSettingsStyles } from '../../../data/styles'

function NewNotifications (props) {
  const { classes } = props

  return (
    <Grid item xs={12} className={classes.drawerContent}>
      <Typography variant='headline' component='h3'>Settings</Typography>
    </Grid>
  )
}

NewNotifications.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(notificationSettingsStyles)(NewNotifications)
