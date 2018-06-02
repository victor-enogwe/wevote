import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepButton from '@material-ui/core/StepButton'
import { questionNavStyles } from '../data/styles'

function QuestionNav (props) {
  const {
    questions,
    activeStep,
    classes,
    goTo,
    getCurrentAnswer,
    responseMap,
    checkStepValidity
  } = props

  return (
    <Grid item xs={12}>
      <Stepper activeStep={activeStep} alternativeLabel nonLinear>
        {Object.keys(questions).map(key => {
          const question = questions[key]
          const { questionId } = question
          const currentAnswer = getCurrentAnswer(questionId, responseMap)
          const stepValid = !checkStepValidity(question, currentAnswer)
          return (<Step
            disabled={stepValid}
            key={questionId}
            className={classes.stepper}
          >
            <StepButton
              disabled={stepValid}
              onClick={goTo.bind(null, question.questionId)}
            />
          </Step>)
        })}
      </Stepper>
    </Grid>
  )
}

QuestionNav.propTypes = {
  questions: PropTypes.object.isRequired,
  activeStep: PropTypes.number.isRequired,
  goTo: PropTypes.func.isRequired,
  checkStepValidity: PropTypes.func.isRequired,
  getCurrentAnswer: PropTypes.func.isRequired,
  responseMap: PropTypes.object.isRequired
}

export default withStyles(questionNavStyles)(QuestionNav)
