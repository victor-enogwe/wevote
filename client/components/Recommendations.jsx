import React, { Component } from 'react'
import { graphql, withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import Grid from 'material-ui/Grid'
import PropTypes from 'prop-types'
import Loader from 'react-loader-advanced'
import { withStyles } from 'material-ui/styles'
import { GET_QUESTIONS } from '../store/queries'
import ListRecommendations from './recommendations/ListRecommendations'
import { recommendationsStyles } from '../data/styles'
import Score from './recommendations/Score'
import PollingUnits from './recommendations/PollingUnits'

class Recommendations extends Component {
  state = { activeQuestionId: 1 }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    responseMap: PropTypes.object.isRequired,
    questions: PropTypes.object.isRequired,
    creatorId: PropTypes.string.isRequired
  }

  getMaxScoreOptions = options => options
    .map(option => option.score)
    .filter(value => (typeof value === 'number'))
    .reduce((a, b) => Math.max(a, b))

  getMaxPossibleScoreQuestion = (question) => {
    const { options, subQuestions } = question

    if (options && options.length > 0) {
      return this.getMaxScoreOptions(options)
    }
    if (subQuestions && subQuestions.length > 0) {
      return subQuestions.map(value => this
        .getMaxPossibleScoreQuestion(value)).reduce((x, y) => (x + y))
    }

    return 0
  }

  getAnsweredQuestions = (questions, responseMap) => Object.keys(responseMap)
    .map(key => questions[key])

  getMaxPossibleScoreQuestions = questions => Object.keys(questions)
    .map(key => questions[key])
    .map(question => this.getMaxPossibleScoreQuestion(question))
    .reduce((a, b) => (a + b))

  getOptionScore = (options, answer) => {
    const selected = options.filter(option => option.title === answer)

    return (selected[0] && selected[0].score) || 0
  }

  getQuestionScore = (question, response) => {
    const { options, subQuestions } = question
    const { answer, subResponses } = response

    if (options && options.length > 0) {
      return this.getOptionScore(options, answer)
    } else if (subQuestions && subQuestions.length > 0) {
      return subQuestions.map(quest => this
        .getQuestionScore(quest, subResponses
          .filter(res => res.question === quest.question) || 0))
        .reduce((a, b) => (a + b))
    }

    return 0
  }

  getUserScore = (answeredQuestions, responseMap) => answeredQuestions
    .map(question => this
      .getQuestionScore(question, responseMap[question.questionId]))
    .reduce((a, b) => (a + b))

  getScoreData = (answeredQuestions, responseMap) => answeredQuestions
    .reduce((a, b, index) => {
      a[b.questionId] = {
        question: b.question,
        label: b.label,
        maxScore: this.getMaxPossibleScoreQuestion(b),
        score: this.getQuestionScore(b, responseMap[b.questionId])
      }

      return a
    }, {})

  getLga = responseMap => Object.keys(responseMap).map(key => responseMap[key])
    .filter(response => response.subResponses &&
      response.subResponses.length > 0)
    .map(response => response.subResponses)
    .reduce((a, b) => ([...a, ...b]), [])
    .filter(response => response.question.includes('local government'))[0]
    .answer

  render () {
    const { classes, responseMap, questions, creatorId } = this.props
    const answeredQuestions = this.getAnsweredQuestions(questions, responseMap)
    const scoreData = this.getScoreData(answeredQuestions, responseMap)
    const maxScore = this.getMaxPossibleScoreQuestions(answeredQuestions)
    const userScore = this.getUserScore(answeredQuestions, responseMap)
    const lga = this.getLga(responseMap)

    return <Grid item xs={12} className={classes.recommendationGrid}>
      <Score
        scoreData={scoreData}
        maxScore={maxScore}
        userScore={userScore}
        creatorId={creatorId}
      />
      <ListRecommendations
        responseMap={responseMap}
        questions={questions}
        scoreData={scoreData}
      />
      <PollingUnits lga={lga} />
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
