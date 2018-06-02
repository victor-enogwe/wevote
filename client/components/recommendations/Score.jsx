import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import LinearProgress from '@material-ui/core/LinearProgress'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import { scoreStyles } from '../../data/styles'
import { theme } from '../../index'
import { RESET_RESPONSE } from '../../store/mutations'

class Score extends Component {
  static propTypes = {
    scoreData: PropTypes.object.isRequired,
    userScore: PropTypes.number.isRequired,
    maxScore: PropTypes.number.isRequired,
    creatorId: PropTypes.string.isRequired
  }
  colors = {
    error: theme.palette.error.dark,
    action: theme.palette.action.active,
    secondary: theme.palette.secondary.main,
    primary: theme.palette.primary.main
  }

  getSentiment = score => {
    const sentiments = [
      { score: 20, icon: 'sentiment_very_dissatisfied', color: 'error' },
      { score: 50, icon: 'sentiment_dissatisfied', color: 'action' },
      { score: 60, icon: 'sentiment_satisfied', color: 'secondary' },
      { score: 100, icon: 'sentiment_very_satisfied', color: 'primary' }
    ]
    let sentiment = sentiments[0]
    sentiments.forEach(value => {
      if (score >= value.score) sentiment = value
    })

    return sentiment
  }

  resetResponseMap = async () => {
    await this.props.client.mutate({
      mutation: RESET_RESPONSE,
      variables: { creatorId: this.props.creatorId }
    })

    this.props.history.replace('/')
  }

  render () {
    const { classes, scoreData, userScore, maxScore } = this.props
    const data = Object.keys(scoreData).map(key => scoreData[key])
    const userPercentage = Math.round((userScore / maxScore) * 100)
    const userPercentageSentiment = this.getSentiment(userPercentage)

    return <ExpansionPanel expanded className={classes.expansion}>
      <ExpansionPanelSummary>
        <Typography className={classes.heading} variant='title'>
          Here's your voter readiness result
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container>
          <Grid item xs={12} sm={12} md={5}>
            <Typography className={classes.subHeading} variant='subheading'>
              Thank you for checking your voter readiness. You are
              <span
                className={classes.chip}
                style={{
                  backgroundColor: this.colors[userPercentageSentiment.color]
                }}
              >
                {userPercentage}%
              </span>
              voter ready
              <br />

              {userPercentage < 100
                ? 'Follow the recommendations below to improve your score.'
                : 'You are ready to vote at the elections.' }
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={7}>
            <Grid container>
              {data.filter(datum => datum.maxScore > 0).map((value, index) => {
                const { maxScore: max, score, label } = value
                const percentage = Math.round((score / max) * 100)
                const sentiment = this.getSentiment(percentage)

                return (
                  <Grid item key={index} xs={12}>
                    <Typography
                      className={classes.subHeading}
                      variant='subheading'
                      gutterBottom
                    >
                      <Icon
                        className={this.props.classes.expansionIcon}
                        color={sentiment.color}
                      >{sentiment.icon}</Icon>
                      {label} - {percentage}%
                    </Typography>
                    <LinearProgress
                      color='primary'
                      variant='determinate'
                      value={percentage}
                    />
                    <br />
                  </Grid>
                )
              })}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.notice} variant='subheading'>
              Exercising your voting franchise entails that you decide&nbsp;
              to vote and ensure that you vote at the elections. Make your&nbsp;
              vote count and avoid any form of election manipulation.&nbsp;
              Let's get credible leaders elected.
            </Typography>
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
      <ExpansionPanelActions>
        <Button size='small' color='default'>SHARE</Button>
        <Button size='small' color='primary' onClick={this.resetResponseMap}>
          CHECK VRI AGAIN
        </Button>
      </ExpansionPanelActions>
    </ExpansionPanel>
  }
}

export default withApollo(withRouter(withStyles(scoreStyles)(Score)))
