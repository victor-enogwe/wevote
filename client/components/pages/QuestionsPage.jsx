import React, { Component } from 'react'
import { graphql, withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import Grid from 'material-ui/Grid'
import PropTypes from 'prop-types'
import Loader from 'react-loader-advanced'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import { GET_QUESTIONS } from '../../store/queries'
import SubQuestions from '../SubQuestions'
import Options from '../Options'
import DateInput from '../DateInput'
import TextInput from '../TextInput'
import { questionStyles } from '../../data/styles'
import QuestionsNav from '../QuestionsNav'
import QuestionsActions from '../QuestionsActions'

class Questions extends Component {
  state = {
    question: this.props.questions[0],
    prevQuestion: null,
    stepAnswers: {}
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    user: PropTypes.object,
    _id: PropTypes.string.isRequired
  }

  componentDidMount () {
    this.setState(prevState => ({
      ...prevState,
      stepAnswers: {
        ...prevState.stepAnswers,
        [this.state.question.questionId]: this.getSelectedAnswer()
      }
    }))
  }

  getSelectedAnswer (question) {
    const { questionId, options } = question ||
      this.state.question
    let selected = null

    if (options && options.length > 0) {
      const option = this.props.user ? this.props.user.responseMap
        .filter(response => response.questionId === questionId)[0] : null
      selected = option ? options
        .filter(value => value.title === option.answer)[0] : null
    } else {
      selected = this.props.user ? this.props.user.responseMap
        .filter(response => response.questionId === questionId)[0] : null
    }

    return selected
  }

  updateStepValidity = (stepAnswer) => {
    const { questionId } = this.state.question
    this.setState(prevState => ({
      ...prevState,
      stepAnswers: { ...prevState.stepAnswers, [questionId]: stepAnswer }
    }))
  }

  next = (nextQuestionId) => this.setState(prevState => {
    if (nextQuestionId) {
      const question = this.props.questions[nextQuestionId - 1]
      return {
        ...prevState,
        question,
        stepAnswers: {
          ...prevState.stepAnswers,
          [question.questionId]: this.getSelectedAnswer(question)
        },
        prevQuestion: prevState.question
      }
    }
  })

  render () {
    const { questions, classes, user, _id } = this.props
    const {
      question,
      question: {
        questionId, question: title, nextQuestionId: id, subQuestions, options
      },
      stepAnswers
    } = this.state
    const { inputType } = question
    const stepAnswer = stepAnswers[questionId]
    const nextQuestionId = stepAnswer ? stepAnswer.nextQuestionId || id : null
    const finished = !(
      id || (options && options[0] && options[0].nextQuestionId)
    )
    const stepValid = subQuestions && subQuestions.length > 0 && stepAnswer
      ? subQuestions.length === (stepAnswer.subResponses &&
      stepAnswer.subResponses.length)
      : Boolean(stepAnswer)

    return <Grid container className={classes.grid}>
      <Grid item xs={12}>
        <Grid container className={classes.questionGrid}>
          <QuestionsNav
            questions={questions}
            activeStep={questionId - 1}
            active={Object.keys(stepAnswers) || []}
            goToQuestion={this.next}
          />

          <Typography className={classes.title}>
            <span>QUESTION {questionId}</span> : {title}
          </Typography>

          {inputType === 'text' ? <TextInput
            question={question}
            selected={stepAnswer}
            _id={_id}
            updateStepValidity={this.updateStepValidity}
          /> : null}

          {inputType === 'option'
            ? <Options
              question={question}
              selected={stepAnswer}
              _id={_id}
              updateStepValidity={this.updateStepValidity}
            />
            : null }

          {inputType === 'date'
            ? <DateInput
              question={question}
              selected={stepAnswer}
              _id={_id}
              updateStepValidity={this.updateStepValidity}
            />
            : null}

          {inputType === 'none'
            ? <SubQuestions
              user={user}
              question={question}
              _id={_id}
              selected={stepAnswer}
              updateStepValidity={this.updateStepValidity}
            />
            : null}

          <QuestionsActions
            stepValidity={stepValid}
            finished={finished}
            next={this.next.bind(null, nextQuestionId)}
          />
        </Grid>
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
    }) => ({
      loading, error, questions
    })
  })(QuestionContainer)))
)
