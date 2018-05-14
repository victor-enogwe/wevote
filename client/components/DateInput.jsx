import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Mutation, withApollo } from 'react-apollo'
import UtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import { withStyles } from 'material-ui/styles'
import moment from 'moment'
import Loader from 'react-loader-advanced'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import DatePicker from 'material-ui-pickers/DatePicker'
import Paper from 'material-ui/Paper'
import { ADD_UPDATE_RESPONSE } from '../store/mutations'
import { dateStyles } from '../data/styles'

class DateInput extends PureComponent {
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

  handleChange = (date, updateResponse) => {
    const defaultAnswer = this.props.currentAnswer || moment()
    const answer = date ? date.format('DD/MM/YYYY') : defaultAnswer
    const {
      question, questionId, subQuestionField, updateSubQuestion, creatorId
    } = this.props
    const dateValid = date ? date.isValid() : null
    const record = { questionId, question, answer, creatorId }

    if (dateValid && !subQuestionField) {
      updateResponse({ variables: { record } })
    } else if (dateValid && subQuestionField) {
      updateSubQuestion(record)
    }
  }

  render () {
    const { classes, question } = this.props

    return (
      <Paper className={classes.paper} square elevation={2}>
        <UtilsProvider utils={MomentUtils}>
          <Mutation
            mutation={ADD_UPDATE_RESPONSE}
            children={(updateResponse, { data, loading, error }) => {
              return (<Loader show={loading} message={'please wait'}>
                <DatePicker
                  disabled={loading}
                  keyboard
                  fullWidth
                  clearable
                  autoOk
                  disableFuture
                  name={question.replace(' ', '-')}
                  format='DD/MM/YYYY'
                  placeholder='DD/MM/YYYY'
                  mask={value => (value
                    ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
                    : [])}
                  minDate={moment('01/01/1900', 'DD/MM/YYYY')}
                  maxDate={moment()}
                  value={moment(this.props.currentAnswer || null, 'DD/MM/YYYY')}
                  animateYearScrolling
                  className={classes.textField}
                  label={question.question}
                  disableOpenOnEnter
                  onChange={date => this.handleChange(date, updateResponse)}
                />
              </Loader>)
            }}
          />
        </UtilsProvider>
      </Paper>
    )
  }
}

export default withApollo(withStyles(dateStyles)(DateInput))
