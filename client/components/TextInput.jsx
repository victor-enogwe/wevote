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
  state = {
    value: this.props.selected ? this.props.selected.answer : '',
    error: ''
  }

  static defaultProps = {
    subField: false
  }

  handleChange = (event, updateResponse) => {
    const value = event.target.value
    const error = !/\w+/.test(value)
    this.setState({ value, error: error ? 'this field is required' : '' })

    const answer = error ? null : {
      answer: value,
      question: this.props.question.question
    }

    if (!this.props.subField && !error) {
      const { question: { questionId } } = this.props
      const record = { questionId, answer: value, creatorId: this.props._id }
      updateResponse({ variables: { record } })
    }

    return this.props.updateStepValidity(answer)
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    question: PropTypes.object.isRequired,
    selected: PropTypes.object,
    subField: PropTypes.bool,
    _id: PropTypes.string.isRequired,
    updateStepValidity: PropTypes.func.isRequired
  }

  render () {
    const { classes, question: { question } } = this.props
    const { error, value } = this.state

    return (
      <Paper className={classes.paper} square elevation={0}>
        <Mutation
          mutation={ADD_UPDATE_RESPONSE}
          children={(updateResponse, { data, loading, error: Error }) => {
            return <Loader show={loading} message={'please wait'}>
              <FormControl
                className={classes.textField}
                error={Boolean(error)}
                aria-describedby={`${question.replace(' ', '')}-error-text`}
              >
                <InputLabel htmlFor={`${question.replace(' ', '')}-error`}>
                  {question}
                </InputLabel>
                <Input
                  disabled={loading}
                  id={`${question.replace(' ', '')}-error-text`}
                  value={value}
                  onChange={event => this.handleChange(event, updateResponse)}
                  fullWidth
                />
                {error ? <FormHelperText id={`${question.replace(' ', '')}-error-text`}>
                  {error}
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
