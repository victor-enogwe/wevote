import React from 'react'
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import PropTypes from 'prop-types'
import Stepper, { Step, StepButton } from 'material-ui/Stepper'
import { questionNavStyles } from '../data/styles'

function QuestionNav (props) {
  const { questions, activeStep, classes, goToQuestion, active } = props

  return (
    <Grid item xs={12}>
      <Stepper activeStep={activeStep} alternativeLabel nonLinear>
        {questions.map(value => {
          const disabled = !active.includes(String(value.questionId))
          return (<Step
            disabled={disabled}
            key={value.questionId}
            className={classes.stepper}
          >
            <StepButton
              disabled={disabled}
              onClick={goToQuestion.bind(null, value.questionId)}
            />
          </Step>)
        })}
      </Stepper>
    </Grid>
  )
}

QuestionNav.propTypes = {
  questions: PropTypes.array.isRequired,
  active: PropTypes.array.isRequired,
  activeStep: PropTypes.number.isRequired,
  goToQuestion: PropTypes.func.isRequired
}

export default withStyles(questionNavStyles)(QuestionNav)
