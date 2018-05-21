import React from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import { withStyles } from 'material-ui/styles'
import Stepper, { Step, StepLabel, StepContent } from 'material-ui/Stepper'
import Button from 'material-ui/Button'
import { ADD_UPDATE_RESPONSE } from '../store/mutations'
import Grid from 'material-ui/Grid'
import TextInput from './TextInput'
import OptionsInput from './OptionsInput'
import DateInput from './DateInput'
import SelectInput from './SelectInput'
import { subQuestionStyles } from '../data/styles'
import { questionInterface, subResponseMapInterface } from '../data/interfaces'

class SubQuestions extends React.Component {
  state = { activeStep: 0 };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    activeQuestion: questionInterface(false, false, true),
    currentAnswers: PropTypes.arrayOf(subResponseMapInterface),
    creatorId: PropTypes.string.isRequired
  }

  formatCurrentAnswers = currentAnswers => {
    return !currentAnswers ? [] : currentAnswers
      .reduce((a, b, index) => {
        return b ? ({ ...a, [b.question]: b.answer }) : a
      }, {})
  }

  updateSubQuestion = async (index, updateAnswer, record) => {
    const {
      currentAnswers,
      creatorId,
      activeQuestion: { questionId }
    } = this.props
    const subResponses = currentAnswers || []
    const updateRecord = {
      questionId, creatorId, subResponses: [...subResponses]
    }

    if (record) {
      updateRecord.subResponses[index] = {
        question: record.question, answer: record.answer
      }
    } else {
      updateRecord.subResponses[index] = record
    }

    updateAnswer({ variables: { record: { ...updateRecord, answer: null } } })
  }

  handleNext = activeStep => this
    .setState(prevState => ({ activeStep: activeStep + 1 }))

  handleBack = activeStep => this
    .setState(prevState => ({ activeStep: activeStep - 1 }))

  render () {
    const { classes, creatorId, currentAnswers } = this.props
    const { subQuestions, questionId } = this.props.activeQuestion
    const { activeStep } = this.state
    const formattedAnswers = this.formatCurrentAnswers(currentAnswers)

    return (
      <Grid item xs={12} className={classes.subQuestions}>
        <Mutation
          mutation={ADD_UPDATE_RESPONSE}
          children={(updateAnswer, { data, loading, error }) => {
            return (
              <Stepper activeStep={activeStep} orientation='vertical'>
                {subQuestions.map((question, index) => {
                  const { question: title, externalData, options } = question
                  const { inputType } = question
                  const currentAnswer = formattedAnswers[title]

                  return (
                    <Step key={index}>
                      <StepLabel>{title}</StepLabel>
                      <StepContent>
                        <Grid container className={classes.subStepContainer}>
                          {inputType === 'text' ? <TextInput
                            question={title}
                            currentAnswer={currentAnswer}
                            creatorId={creatorId}
                            questionId={questionId}
                            subQuestionField
                            updateSubQuestion={this.updateSubQuestion
                              .bind(null, index, updateAnswer)}
                          /> : null}

                          {inputType === 'option'
                            ? <OptionsInput
                              question={title}
                              questionId={questionId}
                              subQuestionField
                              updateSubQuestion={this.updateSubQuestion
                                .bind(null, index, updateAnswer)}
                              currentAnswer={currentAnswer}
                              creatorId={creatorId}
                              options={options}
                            />
                            : null }

                          {inputType === 'date'
                            ? <DateInput
                              question={title}
                              questionId={questionId}
                              subQuestionField
                              updateSubQuestion={this.updateSubQuestion
                                .bind(null, index, updateAnswer)}
                              currentAnswer={currentAnswer}
                              creatorId={creatorId}
                            />
                            : null}

                          {inputType === 'select' && externalData
                            ? <SelectInput
                              question={title}
                              questionId={questionId}
                              subQuestionField
                              updateSubQuestion={this.updateSubQuestion
                                .bind(null, index, updateAnswer)}
                              currentAnswer={currentAnswer}
                              creatorId={creatorId}
                              externalData={externalData}
                            />
                            : null}

                          <Grid item xs={12} className={classes.actions}>
                            <Button
                              disabled={!currentAnswer}
                              variant='raised'
                              color='primary'
                              size='small'
                              onClick={this.handleNext.bind(null, activeStep)}
                              className={classes.button}
                            >
                              {
                                activeStep === subQuestions.length - 1
                                  ? 'Finish' : 'Next'
                              }
                            </Button>
                            <Button
                              size='small'
                              disabled={activeStep === 0}
                              onClick={this.handleBack.bind(null, activeStep)}
                              className={classes.button}
                            >
                                Back
                            </Button>
                          </Grid>
                        </Grid>
                      </StepContent>
                    </Step>
                  )
                })}
              </Stepper>
            )
          }}
        />
      </Grid>
    )
  }
}

export default withStyles(subQuestionStyles)(SubQuestions)
