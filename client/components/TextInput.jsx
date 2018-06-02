import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Mutation, withApollo } from 'react-apollo'
import Loader from 'react-loader-advanced'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
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
      const record = { questionId, answer, creatorId }

      if (!error && !subQuestionField) {
        updateAnswer({ variables: { record } })
      } else if (subQuestionField) {
        updateSubQuestion({ ...record, question })
      }

      return { error: !/\w+/.test(answer) }
    })
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    questionId: PropTypes.string.isRequired,
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
      <Grid item xs={12}>
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
      </Grid>
    )
  }
}

export default withApollo(withStyles(textInputStyles)(TextInput))
