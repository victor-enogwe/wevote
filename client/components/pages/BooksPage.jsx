import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Books from '../Books'

export default class BooksPage extends Component {
  static propTypes = {
    limit: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    filter: PropTypes.shape().isRequired,
    sort: PropTypes.string.isRequired
  }

  render () {
    return <Books {...this.props} />
  }
}
