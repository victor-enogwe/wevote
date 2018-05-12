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
  state = { date: this.props.selected ? this.props.selected.answer : moment() }
  static propTypes = {
    classes: PropTypes.object.isRequired,
    question: PropTypes.object.isRequired,
    selected: PropTypes.object,
    _id: PropTypes.string.isRequired,
    updateStepValidity: PropTypes.func.isRequired,
    subField: PropTypes.bool
  }

  static defaultProps = {
    subField: false
  }

  handleChange = (date, updateResponse) => {
    const answer = date.format('DD/MM/YYYY')
    const { question: { questionId, question } } = this.props
    const record = { questionId, answer, creatorId: this.props._id }

    if (date.isValid()) {
      this.setState({ date: moment(answer, 'DD/MM/YYYY') })

      if (!this.props.subField) {
        updateResponse({ variables: { record } })
      }
    }

    let selected = date.isValid() ? {
      ...this.props.selected, ...record, answer, question
    } : null

    return this.props.updateStepValidity(selected)
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
                  name={question.question.replace(' ', '-')}
                  format='DD/MM/YYYY'
                  placeholder='DD/MM/YYYY'
                  mask={value => (value
                    ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [])}
                  minDate={moment('01/01/1900', 'DD/MM/YYYY')}
                  maxDate={moment()}
                  value={moment(this.state.date, 'DD/MM/YYYY')}
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
