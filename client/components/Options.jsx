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
  static propTypes = {
    _id: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    question: PropTypes.object.isRequired,
    selected: PropTypes.object,
    updateStepValidity: PropTypes.func.isRequired,
    subField: PropTypes.bool
  }

  static defaultProps = {
    subField: false
  }

  componentDidMount () {
    if (this.props.subField) {
      this.props.updateStepValidity(this.formatSelected(this.props.selected))
    }
  }

  handleToggle = (option, updateResponse) => {
    let selected = this.props.selected &&
      this.props.selected.title === option.title ? null : option
    const { question: { question, questionId } } = this.props

    if (selected) {
      const record = {
        questionId, answer: selected.title, creatorId: this.props._id
      }

      if (!this.props.subField) {
        updateResponse({ variables: { record } })
      }
    }

    if (this.props.subField && selected) {
      selected = {
        ...selected,
        question,
        answer: selected.title
      }
    }

    return this.props.updateStepValidity(selected)
  }

  formatSelected = (selected) => {
    let selection = { ...selected }
    if (selected && this.props.subField && !selected.question) {
      selection = {
        ...selection,
        question: this.props.question.question,
        answer: selection.title,
        __typename: 'ResponseSubResponses'
      }
    }

    return selection
  }

  render () {
    const { classes, question: { options }, selected } = this.props

    return (
      <div className={classes.root}>
        <List>
          {options.map((option, index) => {
            return (
              <Mutation
                mutation={ADD_UPDATE_RESPONSE}
                key={index}
                children={(updateResponse, { data, loading, error }) => {
                  return (<Loader show={loading} message={'please wait'}>
                    <Paper className={classes.paper} square elevation={2}>
                      <ListItem
                        disabled={loading}
                        role={undefined}
                        dense
                        button
                        onClick={loading
                          ? () => null : this
                            .handleToggle.bind(null, option, updateResponse)
                        }
                        className={classes.listItem}
                      >
                        <ListItemText primary={option.title} />
                        <ListItemSecondaryAction>
                          <Checkbox
                            disabled={loading}
                            checked={
                              selected ? selected.title === option.title : false
                            }
                            onChange={loading ? () => null : this
                              .handleToggle.bind(null, option, updateResponse)}
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
