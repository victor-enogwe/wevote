import React from 'react'
import PropTypes from 'prop-types'
import { Mutation, withApollo } from 'react-apollo'
import { withStyles } from 'material-ui/styles'
import Loader from 'react-loader-advanced'
import List, {
  ListItem, ListItemSecondaryAction, ListItemText
} from 'material-ui/List'
import Checkbox from 'material-ui/Checkbox'
import Paper from 'material-ui/Paper'
import { ADD_UPDATE_RESPONSE } from '../store/mutations'
import { optionStyles } from '../data/styles'

class Options extends React.Component {
  state = { checked: { title: null, active: false } }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    questionId: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    creatorId: PropTypes.string.isRequired,
    currentAnswer: PropTypes.string,
    subQuestionField: PropTypes.bool,
    updateSubQuestion: PropTypes.func
  }

  static defaultProps = {
    subQuestionField: false
  }

  setChecked = (answer, updateAnswer) => {
    const {
      question,
      questionId,
      creatorId,
      currentAnswer,
      subQuestionField,
      updateSubQuestion
    } = this.props
    const record = { questionId, answer, creatorId, question }
    const isNew = answer !== currentAnswer

    if (isNew && !subQuestionField) {
      updateAnswer({ variables: { record } })
    } else if (isNew && subQuestionField) {
      updateSubQuestion(record)
    }
  }

  render () {
    const { classes, options, currentAnswer } = this.props

    return (
      <div className={classes.root}>
        <List>
          {options.map((option, index) => {
            const { title: answer } = option

            return (
              <Mutation
                mutation={ADD_UPDATE_RESPONSE}
                key={index}
                children={(updateAnswer, { data, loading, error }) => {
                  return (<Loader show={loading} message={'please wait'}>
                    <Paper className={classes.paper} square elevation={2}>
                      <ListItem
                        disabled={loading}
                        role={undefined}
                        dense
                        button
                        onClick={this.setChecked
                          .bind(null, answer, updateAnswer)}
                        className={classes.listItem}
                      >
                        <ListItemText primary={answer} />
                        <ListItemSecondaryAction>
                          <Checkbox
                            disabled={loading}
                            checked={answer === currentAnswer}
                            onClick={this
                              .setChecked.bind(null, answer, updateAnswer)}
                            tabIndex={-1}
                            disableRipple
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </Paper>
                  </Loader>)
                }}
              />
            )
          })}
        </List>
      </div>
    )
  }
}

export default withApollo(withStyles(optionStyles)(Options))
