import React, { Component } from 'react'
import { graphql, withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import Grid from 'material-ui/Grid'
import PropTypes from 'prop-types'
import Loader from 'react-loader-advanced'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import { GET_QUESTIONS, GET_CURRENT_USER } from '../../store/queries'
import SubQuestions from '../SubQuestions'
import OptionsInput from '../OptionsInput'
import DateInput from '../DateInput'
import TextInput from '../TextInput'
import { questionStyles } from '../../data/styles'
import QuestionsNav from '../QuestionsNav'
import QuestionsActions from '../QuestionsActions'
import Recommendations from '../Recommendations'
import { questionInterface, responseMapInterface } from '../../data/interfaces'

export const formatQuestionAndResponseMap = data => data
  .reduce((a, b, index) => ({ ...a, [b.questionId]: { ...b, index } }), {})
class Questions extends Component {
  state = { activeQuestionId: 1 }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    questions: PropTypes.arrayOf(questionInterface(false, false, false)),
    creatorId: PropTypes.string.isRequired,
    responseMap: responseMapInterface,
    vriTaken: PropTypes.bool.isRequired
  }

  getCurrentAnswer = (questionId, responseMap) => {
    try {
      const response = responseMap[questionId]

      return response.answer || (response.subResponses.length > 0
        ? response.subResponses : null)
    } catch (error) {
      return null
    }
  }

  getNextQuestionId = (activeQuestion, currentAnswer) => {
    let { nextQuestionId, options } = activeQuestion
    const option = options && options.filter(
      option => option.title === currentAnswer
    )[0]
    nextQuestionId = option ? option.nextQuestionId : nextQuestionId

    return nextQuestionId
  }

  stepsFinished = (activeQuestion, currentAnswer) => (!this
    .getNextQuestionId(activeQuestion, currentAnswer) && Boolean(currentAnswer))

  next = (activeQuestion, currentAnswer, finished) => {
    this.setState(prevState => ({
      activeQuestionId: this.getNextQuestionId(activeQuestion, currentAnswer)
    }))

    if (finished) {
      this.props.client.writeData({
        id: `User:${this.props.creatorId}`, data: { vriTaken: true }
      })
    }
  }

  goTo = id => this.setState(prevState => ({ activeQuestionId: id }))

  render () {
    const { classes, creatorId, vriTaken } = this.props
    const questions = formatQuestionAndResponseMap(this.props.questions)
    const responseMap = formatQuestionAndResponseMap(this.props.responseMap)
    const { activeQuestionId } = this.state
    const currentAnswer = this.getCurrentAnswer(activeQuestionId, responseMap)
    const activeQuestion = questions[activeQuestionId]
    const { question, questionId, inputType, options } = activeQuestion
    const finished = this.stepsFinished(activeQuestion, currentAnswer)
    const stepValid = responseMap[activeQuestionId] &&
      (responseMap[activeQuestionId].answer ||
      responseMap[activeQuestionId].subResponses
        .every(response => response.answer))

    return <Grid container className={classes.grid}>
      <Grid item xs={12}>
        {!vriTaken ? <Grid container className={classes.questionGrid}>
          <QuestionsNav
            questions={questions}
            activeStep={activeQuestion.index}
            goTo={this.goTo}
          />

          <Typography className={classes.question}>{question}</Typography>

          {inputType === 'text' ? <TextInput
            question={question}
            questionId={questionId}
            currentAnswer={currentAnswer}
            creatorId={creatorId}
          /> : null}

          {inputType === 'option'
            ? <OptionsInput
              question={question}
              questionId={questionId}
              currentAnswer={currentAnswer}
              creatorId={creatorId}
              options={options}
            />
            : null }

          {inputType === 'date'
            ? <DateInput
              question={question}
              questionId={questionId}
              currentAnswer={currentAnswer}
              creatorId={creatorId}
            />
            : null}

          {inputType === 'none'
            ? <SubQuestions
              activeQuestion={activeQuestion}
              currentAnswers={currentAnswer}
              creatorId={creatorId}
            />
            : null}

          <QuestionsActions
            stepValidity={Boolean(stepValid)}
            finished={finished}
            next={this.next.bind(null, activeQuestion, currentAnswer, finished)}
          />
        </Grid> : <Recommendations />}
      </Grid>
    </Grid>
  }
}

const QuestionContainer = (props) => (
  <Loader show={props.loading} message='please wait'>
    {!props.loading ? <Questions {...props} /> : null}
  </Loader>
)

export default withStyles(questionStyles)(
  withApollo(withRouter(graphql(GET_QUESTIONS, {
    props: ({
      data: { QuestionFindMany: questions = null, error, loading }
    }) => ({ loading, error, questions })
  })(QuestionContainer)))
)
