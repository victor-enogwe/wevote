import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { Mutation, withApollo } from 'react-apollo'
import Paper from 'material-ui/Paper'
import Loader from 'react-loader-advanced'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'
import { ADD_UPDATE_RESPONSE } from '../store/mutations'
import { textInputStyles } from '../data/styles'

class TextInput extends Component {
  state = { error: false }

  setAnswer = (event, updateAnswer) => {
    event.persist()
    const {
      question, questionId, creatorId, subQuestionField, updateSubQuestion
    } = this.props

    return this.setState(prevState => {
      const answer = event.target.value || ''
      const error = !/\w+/.test(answer)
      const record = { questionId, answer, creatorId, question }

      if (!error && !subQuestionField) {
        updateAnswer({ variables: { record } })
      } else if (subQuestionField) {
        updateSubQuestion(record)
      }

      return { error: !/\w+/.test(answer) }
    })
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    questionId: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    creatorId: PropTypes.string.isRequired,
    currentAnswer: PropTypes.string,
    subQuestionField: PropTypes.bool,
    updateSubQuestion: PropTypes.func
  }

  static defaultProps = {
    subQuestionField: false
  }

  render () {
    const { classes, question, currentAnswer } = this.props
    const { error } = this.state

    return (
      <Paper className={classes.paper} square elevation={0}>
        <Mutation
          mutation={ADD_UPDATE_RESPONSE}
          children={(updateAnswer, { data, loading, error: Error }) => {
            return <Loader show={loading} message={'please wait'}>
              <FormControl
                className={classes.textField}
                error={error || Error}
                aria-describedby={`${question.replace(' ', '')}-error-text`}
              >
                <InputLabel htmlFor={`${question.replace(' ', '')}-error`}>
                  {question}
                </InputLabel>
                <Input
                  id={`${question.replace(' ', '')}-error-text`}
                  defaultValue={currentAnswer}
                  fullWidth
                  disabled={loading}
                  onChange={event => this.setAnswer(event, updateAnswer)}
                />
                {error || Error
                  ? <FormHelperText
                    id={`${question.replace(' ', '')}-error-text`}
                  >
                    {'this field is required' || Error}
                  </FormHelperText> : null}
              </FormControl>
            </Loader>
          }}
        />
      </Paper>
    )
  }
}

export default withApollo(withStyles(textInputStyles)(TextInput))
