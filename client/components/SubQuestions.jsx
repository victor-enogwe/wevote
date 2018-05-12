import React from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import { withStyles } from 'material-ui/styles'
import Stepper, { Step, StepLabel, StepContent } from 'material-ui/Stepper'
import Button from 'material-ui/Button'
import { ADD_UPDATE_RESPONSE } from '../store/mutations'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import TextInput from './TextInput'
import Options from './Options'
import DateInput from './DateInput'
import SelectInput from './SelectInput'
import { subQuestionStyles } from '../data/styles'
import states from '../data/States.js'

const formatStates = (data) => data.reduce((a, b) => ({
  ...a, state: { locals: [...a.state.locals, ...b.state.locals] }
})).state.locals.map(value => ({
  value: value.name.toLowerCase(), label: value.name.toLowerCase()
}))

class SubQuestions extends React.Component {
  state = {
    activeStep: 0,
    stepAnswers: {
      0: this.getSelectedAnswer()
    }
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object,
    question: PropTypes.object.isRequired,
    selected: PropTypes.object,
    _id: PropTypes.string.isRequired,
    updateStepValidity: PropTypes.func.isRequired
  }

  getSelectedAnswer (value) {
    const activeStep = this.state ? this.state.activeStep : 0
    const { question, options } = value ||
      this.props.question.subQuestions[activeStep]
    let selected = null

    if (options.length > 0) {
      const option = this.props.selected ? this.props.selected.subResponses
        .filter(response => response.question === question)[0] : null
      selected = option ? options
        .filter(value => value.title === option.answer)[0] : null
    } else {
      selected = this.props.selected ? this.props.selected.subResponses
        .filter(response => response.question === question)[0] : null
    }

    return selected
  }

  handleNext = () => this.setState(prevState => {
    const update = {
      ...prevState,
      activeStep: prevState.activeStep + 1,
      stepAnswers: {
        ...prevState.stepAnswers
      }
    }
    let selected = {}

    if (!prevState.stepAnswers[prevState.activeStep + 1]) {
      selected = this.getSelectedAnswer(
        this.props.question.subQuestions[prevState.activeStep + 1]
      )
      update.stepAnswers[prevState.activeStep + 1] = selected
    }

    return update
  })

  saveStep = (updateResponse) => {
    const subResponses = Object.keys(this.state.stepAnswers).map(item => {
      return this.state.stepAnswers[item]
    })
    delete subResponses[5]
    const { question: { questionId } } = this.props
    const record = {
      questionId,
      creatorId: this.props._id,
      answer: null,
      subResponses: subResponses.filter(response => response)
    }
    updateResponse({ variables: { record } })
    this.handleNext()
  }

  handleBack = () => this.setState(prevState => {
    return ({
      ...prevState,
      activeStep: this.state.activeStep - 1
    })
  })

  setAnswer = answer => this.setState(prevState => {
    const update = {
      ...prevState,
      stepAnswers: {
        ...prevState.stepAnswers,
        [prevState.activeStep]: answer
      }
    }
    let selected = {}
    if (!prevState.stepAnswers[prevState.activeStep + 1]) {
      selected = this.getSelectedAnswer(
        this.props.question.subQuestions[prevState.activeStep + 1]
      )
      update.stepAnswers[prevState.activeStep + 1] = selected
    }

    return update
  })

  render () {
    const {
      classes, question: { subQuestions }, updateStepValidity, _id
    } = this.props
    const { activeStep, stepAnswers } = this.state
    const stepAnswer = stepAnswers[activeStep]

    return (
      <Mutation
        mutation={ADD_UPDATE_RESPONSE}
        children={(updateSubquestion, { data, loading, error }) => {
          return (
            <Paper square elevation={0} className={classes.resetContainer}>
              <Stepper activeStep={activeStep} orientation='vertical'>
                {subQuestions.map((question, index) => {
                  const { question: title, externalData } = question
                  const { inputType } = question
                  return (
                    <Step key={index}>
                      <StepLabel>{title}</StepLabel>
                      <StepContent>
                        <Grid className={classes.subStepContainer}>
                          <Grid item xs={12}>
                            {inputType === 'text' ? <TextInput
                              question={question}
                              selected={stepAnswer}
                              subField
                              _id={_id}
                              updateStepValidity={this.setAnswer}
                            /> : null}

                            {inputType === 'option'
                              ? <Options
                                question={question}
                                selected={stepAnswer}
                                subField
                                _id={_id}
                                updateStepValidity={this.setAnswer}
                              />
                              : null }

                            {inputType === 'date'
                              ? <DateInput
                                question={question}
                                selected={stepAnswer}
                                subField
                                _id={_id}
                                updateStepValidity={this.setAnswer}
                              />
                              : null}

                            {inputType === 'select' && externalData === 'lga'
                              ? <SelectInput
                                question={question}
                                selected={stepAnswer}
                                options={formatStates(states)}
                                label='Select your local government (the lga you live in)'
                                subField
                                _id={_id}
                                updateStepValidity={this.setAnswer}
                              />
                              : null}

                            <div className={classes.actionsContainer}>
                              <Button
                                disabled={!stepAnswer}
                                variant='raised'
                                color='primary'
                                size='small'
                                onClick={activeStep === subQuestions.length - 1
                                  ? () => this.saveStep(
                                    updateSubquestion, updateStepValidity
                                  )
                                  : this.handleNext}
                                className={classes.button}
                              >
                                {
                                  activeStep === subQuestions.length - 1
                                    ? 'Save Step' : 'Next'
                                }
                              </Button>
                              <Button
                                size='small'
                                disabled={activeStep === 0}
                                onClick={this.handleBack}
                                className={classes.button}
                              >
                        Back
                              </Button>
                            </div>
                          </Grid>
                        </Grid>
                      </StepContent>
                    </Step>
                  )
                })}
              </Stepper>
            </Paper>
          )
        }}
      />
    )
  }
}

export default withStyles(subQuestionStyles)(SubQuestions)
