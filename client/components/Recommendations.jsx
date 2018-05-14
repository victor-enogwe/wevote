import React, { Component } from 'react'
import { graphql, withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import Grid from 'material-ui/Grid'
import PropTypes from 'prop-types'
import Loader from 'react-loader-advanced'
import { withStyles } from 'material-ui/styles'
import { GET_QUESTIONS } from '../store/queries'
import { recommendationsStyles } from '../data/styles'
import { responseMapInterface } from '../data/interfaces'

class Recommendations extends Component {
  state = { activeQuestionId: 1 }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    responseMap: responseMapInterface
  }

  render () {
    const { classes } = this.props

    return <Grid container className={classes.recomendationGrid}>
          hello
    </Grid>
  }
}

const RecommendationsContainer = (props) => (
  <Loader show={props.loading || false} message='please wait'>
    {!props.loading ? <Recommendations {...props} /> : null}
  </Loader>
)

export default withStyles(recommendationsStyles)(
  withApollo(withRouter(graphql(GET_QUESTIONS, {
    props: ({
      data: { QuestionFindMany: questions = null, error, loading }
    }) => ({ loading, error, questions }),
    skip: true
  })(RecommendationsContainer)))
)
