import React, { Component } from 'react'
import { graphql, withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import Grid from 'material-ui/Grid'
import PropTypes from 'prop-types'
import Loader from 'react-loader-advanced'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import { GET_QUESTIONS } from '../../store/queries'
import {
  CREATE_USER_RESPONSE_MAP, UPDATE_USER_PROFILE
} from '../../store/mutations'
import SubQuestions from '../SubQuestions'
import OptionsInput from '../OptionsInput'
import DateInput from '../DateInput'
import TextInput from '../TextInput'
import SelectInput from '../SelectInput'
import { questionStyles } from '../../data/styles'
import QuestionsNav from '../QuestionsNav'
import QuestionsActions from '../QuestionsActions'
import Recommendations from '../Recommendations'
import { questionInterface } from '../../data/interfaces'
import { omitTypeName } from '../../store/resolvers'

export const formatQuestionAndResponseMap = data => data
  .reduce((a, b, index) => ({ ...a, [b.questionId]: { ...b, index } }), {})
class QuestionsPage extends Component {
  state = { activeQuestionId: 1 }

  componentDidMount () {
    const { responseMap } = this.props.user
    this.setState(prevState => ({
      ...prevState, activeQuestionId: this.setQuestionIdOnLoad(responseMap)
    }))
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    questions: PropTypes.arrayOf(questionInterface(false, false, false)),
    user: PropTypes.object.isRequired,
    creatorId: PropTypes.string.isRequired
  }

  setQuestionIdOnLoad = responseMap => {
    const lastQuestion = responseMap.slice(-1)
    const lastQuestionId = lastQuestion.length > 0
      ? lastQuestion[0].questionId : 1

    return lastQuestionId
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

  stepValid = (activeQuestion, currentAnswer) => {
    let hasAnswer = false
    if (Array.isArray(currentAnswer)) {
      hasAnswer = currentAnswer.length === activeQuestion.subQuestions.length &&
        currentAnswer.every(answer => answer.answer)
    } else {
      hasAnswer = Boolean(currentAnswer)
    }

    return hasAnswer
  }

  stepsFinished = (activeQuestion, currentAnswer) => {
    const lastQuestion = !this.getNextQuestionId(activeQuestion, currentAnswer)
    let hasAnswer = this.stepValid(activeQuestion, currentAnswer)

    return lastQuestion && hasAnswer
  }

  next = async (activeQuestion, currentAnswer, finished) => {
    if (finished) {
      await this.props.client.writeData({
        id: `User:${this.props.creatorId}`, data: { vriTaken: true }
      })
    }

    if (finished && this.props.creatorId !== 'guest') {
      await this.props.client.mutate({
        mutation: CREATE_USER_RESPONSE_MAP,
        variables: { records: this.props.user.responseMap.map(response => {
          const { answer, questionId, creatorId } = response
          const subResponses = response.subResponses.map(subResponse => {
            const { answer, question } = subResponse

            return { answer, question }
          })
          return { answer, questionId, creatorId, subResponses }
        }) }
      })
      const { responseMap, ...record } = omitTypeName(this.props.user)

      await this.props.client.mutate({
        mutation: UPDATE_USER_PROFILE,
        variables: { record }
      })
    }

    if (!finished) {
      this.setState(prevState => ({
        activeQuestionId: this.getNextQuestionId(activeQuestion, currentAnswer)
      }))
    }
  }

  goTo = id => this.setState(prevState => ({ activeQuestionId: id }))

  render () {
    const { classes, creatorId, user, questions } = this.props
    const { vriTaken, responseMap } = user
    const formattedQquestions = formatQuestionAndResponseMap(questions)
    const formattedResponseMap = formatQuestionAndResponseMap(responseMap)
    const { activeQuestionId } = this.state
    const currentAnswer = this
      .getCurrentAnswer(activeQuestionId, formattedResponseMap)
    const activeQuestion = formattedQquestions[activeQuestionId]
    const {
      question, questionId, inputType, options, externalData
    } = activeQuestion
    const finished = this.stepsFinished(activeQuestion, currentAnswer)
    const stepValid = this.stepValid(activeQuestion, currentAnswer)

    return <Grid container className={classes.grid}>
      <Grid item xs={12}>
        {!vriTaken ? <Grid container className={classes.questionGrid}>
          <QuestionsNav
            questions={formattedQquestions}
            responseMap={formattedResponseMap}
            getCurrentAnswer={this.getCurrentAnswer}
            checkStepValidity={this.stepValid}
            activeStep={activeQuestion.index}
            goTo={this.goTo}
          />

          <Grid item xs={12} className={classes.questionTitleGrid}>
            <Typography className={classes.question}>{question}</Typography>
          </Grid>

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

          {inputType === 'select' && externalData
            ? <SelectInput
              question={question}
              questionId={questionId}
              currentAnswer={currentAnswer}
              creatorId={creatorId}
              externalData={externalData}
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
            stepValidity={stepValid}
            finished={finished}
            next={this.next.bind(null, activeQuestion, currentAnswer, finished)}
          />
        </Grid> : <Recommendations
          responseMap={formattedResponseMap}
          questions={formattedQquestions}
          creatorId={creatorId}
        />}
      </Grid>
    </Grid>
  }
}

const QuestionContainer = (props) => (
  <Loader show={props.loading} message='please wait'>
    {!props.loading ? <QuestionsPage {...props} /> : null}
  </Loader>
)

export default withStyles(questionStyles)(
  withApollo(withRouter(graphql(GET_QUESTIONS, {
    props: ({
      data: { QuestionFindMany: questions = null, error, loading }
    }) => ({ loading, error, questions })
  })(QuestionContainer)))
)
