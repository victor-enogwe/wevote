import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { Mutation, withApollo } from 'react-apollo'
import Paper from 'material-ui/Paper'
import Loader from 'react-loader-advanced'
import Typography from 'material-ui/Typography'
import Input from 'material-ui/Input'
import { MenuItem } from 'material-ui/Menu'
import ArrowDropDownIcon from 'material-ui-icons/ArrowDropDown'
import CancelIcon from 'material-ui-icons/Cancel'
import ArrowDropUpIcon from 'material-ui-icons/ArrowDropUp'
import ClearIcon from 'material-ui-icons/Clear'
import Chip from 'material-ui/Chip'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import { ADD_UPDATE_RESPONSE } from '../store/mutations'
import { selectInputStyles } from '../data/styles'

class Option extends React.Component {
  handleClick = event => {
    this.props.onSelect(this.props.option, event)
  };

  render () {
    const { children, isFocused, isSelected, onFocus } = this.props

    return (
      <MenuItem
        onFocus={onFocus}
        selected={isFocused}
        onClick={this.handleClick}
        component='div'
        style={{
          fontWeight: isSelected ? 500 : 400
        }}
      >
        {children}
      </MenuItem>
    )
  }
}

function SelectWrapped (props) {
  const { classes, ...other } = props

  return (
    <Select
      optionComponent={Option}
      noResultsText={<Typography>{'No results found'}</Typography>}
      arrowRenderer={arrowProps => {
        return arrowProps.isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
      }}
      clearRenderer={() => <ClearIcon />}
      valueComponent={valueProps => {
        const { value, children, onRemove } = valueProps

        const onDelete = event => {
          event.preventDefault()
          event.stopPropagation()
          onRemove(value)
        }

        if (onRemove) {
          return (
            <Chip
              tabIndex={-1}
              label={children}
              className={classes.chip}
              deleteIcon={<CancelIcon onTouchEnd={onDelete} />}
              onDelete={onDelete}
            />
          )
        }

        return <div className='Select-value'>{children}</div>
      }}
      {...other}
    />
  )
}

class SelectInput extends React.Component {
  state = {
    value: this.props.selected ? this.props.selected.answer : '',
    error: ''
  }

  static defaultProps = {
    subField: false
  }

  handleChange = (name, updateResponse) => (value) => {
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
    options: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
    subField: PropTypes.bool,
    updateStepValidity: PropTypes.func.isRequired,
    _id: PropTypes.string.isRequired
  }

  render () {
    const { classes, options, label } = this.props
    const { value } = this.state

    return (
      <Paper className={classes.paper} square elevation={0}>
        <Mutation
          mutation={ADD_UPDATE_RESPONSE}
          children={(updateResponse, { data, loading, error: Error }) => {
            return <Loader show={loading} message={'please wait'}>
              <Input
                fullWidth
                inputComponent={SelectWrapped}
                value={value}
                onChange={this.handleChange('single', updateResponse)}
                placeholder={label}
                id={`${label}-select`}
                inputProps={{
                  classes,
                  name: `${label}-select`,
                  instanceId: `${label}-select`,
                  simpleValue: true,
                  options
                }}
              />
            </Loader>
          }}
        />
      </Paper>
    )
  }
}

export default withApollo(withStyles(selectInputStyles)(SelectInput))
