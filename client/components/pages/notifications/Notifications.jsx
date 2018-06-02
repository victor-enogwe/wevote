import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import moment from 'moment'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { notificationStyles } from '../../../data/styles'

function Notifications (props) {
  const { classes, notifications } = props
  const { edges = [] } = notifications

  return (
    <Grid item xs={12} className={classes.drawerContent}>
      {edges.map((notification, key) => {
        const { node: { title, message, createdAt } } = notification
        return (
          <Paper elevation={4} key={key} className={classes.notice}>
            <Typography variant='headline' component='h3'>
              {title}
              <span style={{
                float: 'right',
                fontSize: '0.5em'
              }}>
                {moment(new Date(createdAt)).format('MMM DD YYYY')}
              </span>
            </Typography>
            <Typography component='p'>
              {message}
            </Typography>
          </Paper>
        )
      })}
    </Grid>
  )
}

Notifications.propTypes = {
  classes: PropTypes.object.isRequired,
  notifications: PropTypes.object.isRequired
}

export default withStyles(notificationStyles)(Notifications)
