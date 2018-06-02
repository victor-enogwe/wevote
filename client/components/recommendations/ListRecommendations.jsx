import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Icon from '@material-ui/core/Icon'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import PollingUnits from './PollingUnits'
import RegCenters from './RegCenters'
import { listRecommendationsStyles } from '../../data/styles'

class RecommendationList extends Component {
  state = { expanded: Object.keys(this.props.responseMap).length + 1 };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    lga: PropTypes.string.isRequired
  }

  handleChange = panel => (event, expanded) => this
    .setState({ expanded: expanded ? panel : false })

  getRecommendation = (response, question) => {
    const { options, subQuestions = [], recommendation } = question
    const { answer, subResponses } = response

    if (recommendation) {
      return recommendation
    }

    if (options.length > 0) {
      return options.filter(option => option.title === answer)[0].recommendation
    }

    if (subQuestions.length > 0) {
      return subQuestions.map(question => this
        .getRecommendation(subResponses
          .filter(subResponse => (subResponse.question === question.question)
          )[0], question)).join('')
    }

    return null
  }

  getResponseOptions = (response, question) => {
    const { options, subQuestions = [] } = question
    const { answer, subResponses } = response

    if (options.length > 0) {
      return options.filter(option => option.title === answer)
    }

    if (subQuestions.length > 0) {
      return subQuestions.map(question => this
        .getResponseOptions(subResponses
          .filter(subResponse => (subResponse.question === question.question)
          )[0], question)).filter(option => option)
        .reduce((a, b) => ([...a, ...b]), [])
    }

    return null
  }

  render () {
    const { expanded } = this.state
    const { classes, responseMap, questions, scoreData, lga } = this.props
    const responseKeys = Object.keys(responseMap)

    return <div>
      {responseKeys.map((key, index) => {
        const question = questions[key]
        const { label } = question
        const response = responseMap[key]
        const { maxScore, score } = scoreData[key]
        let recommendations = this.getRecommendation(response, question)
        recommendations = recommendations ? recommendations.split('.')
          .filter(recommendation => recommendation) : []

        return (
          !recommendations.length > 0 ? null : <ExpansionPanel
            expanded={(expanded === (index))}
            onChange={this.handleChange(index)}
            key={key}
            className={classes.expansion}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading} variant='title'>
                {maxScore === score
                  ? <span>
                    <Icon
                      color='primary'
                      className={classes.expansionIcon}
                    >
                          done_outline
                    </Icon> {label}
                  </span>
                  : <span>
                    <Icon
                      color='error'
                      className={classes.expansionIcon}
                    >
                          warning
                    </Icon> {label}
                  </span>}

              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <List component='ul'>
                {recommendations.map((recommendation, index) => (
                  <div key={recommendation}>
                    <ListItem>
                      <ListItemIcon>
                        <Icon color='action'>bookmark</Icon>
                      </ListItemIcon>
                      <ListItemText secondary={recommendation} />
                    </ListItem>
                    {index !== recommendations.length - 1 && <Divider />}
                  </div>
                ))}
              </List>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )
      })}
      <PollingUnits
        lga={lga}
        expanded={(expanded === (responseKeys.length))}
        onChange={this.handleChange.bind(null, responseKeys.length)}
      />
      <RegCenters
        lga={lga}
        expanded={(expanded === (responseKeys.length + 1))}
        onChange={this.handleChange.bind(null, responseKeys.length + 1)}
      />
    </div>
  }
}

export default withStyles(listRecommendationsStyles)(RecommendationList)
