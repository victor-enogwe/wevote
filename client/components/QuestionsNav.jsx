import React from 'react'
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import PropTypes from 'prop-types'
import Stepper, { Step, StepButton } from 'material-ui/Stepper'
import { questionNavStyles } from '../data/styles'

function QuestionNav (props) {
  const { questions, activeStep, classes, goTo } = props

  return (
    <Grid item xs={12}>
      <Stepper activeStep={activeStep} alternativeLabel nonLinear>
        {Object.keys(questions).map(key => {
          const question = questions[key]
          // const disabled = !active.includes(String(question.questionId))
          return (<Step
            // disabled={disabled}
            key={question.questionId}
            className={classes.stepper}
          >
            <StepButton
              // disabled={disabled}
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
  goTo: PropTypes.func.isRequired
}

export default withStyles(questionNavStyles)(QuestionNav)
