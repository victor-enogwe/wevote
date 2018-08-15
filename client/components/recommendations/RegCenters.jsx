import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import CircularProgress from '@material-ui/core/CircularProgress'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import { scoreStyles } from '../../data/styles'
import states from '../../data/States'
import regCenters from '../../../reg-centers/reg-centers.json'

class RegCenters extends Component {
  state = { numPages: 0, pageIndex: 0 }
  static propTypes = {
    classes: PropTypes.object.isRequired,
    lga: PropTypes.string.isRequired,
    expanded: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
  }

  async componentWillMount () {
    this.pdfLib = await import(
      /* webpackPrefetch: true webpackChunkName: "pdf" */
      'react-pdf/dist/entry.noworker'
    )
  }

  getStateFromLga = (lga) => {
    const regexState = new RegExp(lga, 'gi')

    return states.filter(state => regexState
      .test(JSON.stringify(state.state.locals)))[0]
      .state.name.replace(' State', '').toUpperCase()
  }

  onLoadPdf = ({ numPages }) => this
    .setState(prevState => ({ ...prevState, numPages }))

  onLoadPdfPageLoad = async (page) => {
    const pdf = document.getElementsByTagName('canvas')[0]
    pdf.style.width = '100%'
    pdf.style.height = 'auto'
  }

  onGetTextSuccess = async (items) => {
    const { pageIndex, numPages } = this.state
    const search = new RegExp(this.props.lga, 'gi')
    const correctPage = search.test(JSON.stringify(items))
    if (!correctPage && (pageIndex + 1 < numPages)) {
      // react no-op issue @TODO
      this.setState(prevState => ({
        ...prevState, pageIndex: prevState.pageIndex + 1
      }))
      console.clear()
    }
  }

  render () {
    const { Document, Page } = this.pdfLib.default
    const { classes, lga, expanded, onChange } = this.props
    const { pageIndex } = this.state
    const pdfUrl = regCenters[this.getStateFromLga(lga)]
    const url = `${API_URL}inec/centers?url=${pdfUrl}`

    return <ExpansionPanel
      expanded={expanded} onChange={onChange()} className={classes.expansion}
    >
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading} variant='title'>
          Registration Centers In your LGA
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container className={classes.mapGrid}>
          <Grid item xs={12}>
            <Grid container justify='center' alignContent='center'>
              <Document
                file={url}
                loading={<CircularProgress
                  size={200} thickness={1} className={classes.progress}
                />}
                onLoadSuccess={this.onLoadPdf}
              >
                <Page
                  pageIndex={pageIndex}
                  onLoadSuccess={this.onLoadPdfPageLoad}
                  onGetTextSuccess={this.onGetTextSuccess}
                />
              </Document>
            </Grid>
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  }
}

export default withStyles(scoreStyles)(RegCenters)
