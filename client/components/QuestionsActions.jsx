import React, { Component } from 'react'
import Button from 'material-ui/Button'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import { questionActionStyles } from '../data/styles'

class QuestionsActions extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    stepValidity: PropTypes.bool.isRequired,
    finished: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired
  }

  render () {
    const {
      finished, stepValidity, next, classes
    } = this.props
    return <Grid item xs={12}>
      <Button
        className={classes.buttons}
        disabled={!stepValidity}
        variant='raised'
        color='secondary'
        onClick={finished ? null : next}
      >
        {finished ? 'SEE RECOMMENDATIONS' : 'Next'}
      </Button>
    </Grid>
  }
}

export default withStyles(questionActionStyles)(QuestionsActions)
