import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import List from 'material-ui/List'
import ListItem from 'material-ui/List/ListItem'
import ListItemIcon from 'material-ui/List/ListItemIcon'
import ListItemText from 'material-ui/List/ListItemText'
import Divider from 'material-ui/Divider'
import Icon from 'material-ui/Icon'
import ExpansionPanel, {
  ExpansionPanelDetails, ExpansionPanelSummary
} from 'material-ui/ExpansionPanel'
import Typography from 'material-ui/Typography'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import { listRecommendationsStyles } from '../../data/styles'

class RecommendationList extends Component {
  state = { expanded: 'score' };

  static propTypes = {
    classes: PropTypes.object.isRequired
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
    const { classes, responseMap, questions, scoreData } = this.props
    const responseKeys = Object.keys(responseMap)

    return responseKeys.map((key, index) => {
      const question = questions[key]
      const { label } = question
      const response = responseMap[key]
      const { maxScore, score } = scoreData[key]
      const options = this.getResponseOptions(response, question)
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

            {options.map(option => {
              if (option.externalData) {
                console.log(option.externalData)
              }
            })}
            {/* <Typography>{recommendation}</Typography> */}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )
    })
  }
}

export default withStyles(listRecommendationsStyles)(RecommendationList)
