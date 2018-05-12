export const appStyles = theme => ({
  page: {
    backgroundColor: theme.palette.primary.main,
    height: `calc(80vh - ${theme.spacing.unit}px)`,
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignContent: 'center',
    flexFlow: 'row wrap',
    padding: theme.spacing.unit
  }
})
export const questionStyles = theme => ({
  grid: {
    height: 'calc(80vh - 15px)',
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignContent: 'center',
    maxWidth: 800,
    overflowY: 'scroll',
    padding: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  questionGrid: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignContent: 'center',
    minHeight: '100%'
  },
  title: {
    backgroundColor: theme.palette.background.paper,
    textTransform: 'uppercase',
    width: '100%',
    padding: theme.spacing.unit,
    fontWeight: 900,
    textAlign: 'center',
    span: {
      color: '#fff'
    }
  },
  question: {
    backgroundColor: theme.palette.background.paper,
    margin: theme.spacing.unit
  }
})

export const questionNavStyles = theme => ({
  stepper: {
    marginBottom: -(theme.spacing.unit)
  }
})

export const questionActionStyles = theme => ({
  buttons: {
    marginTop: theme.spacing.unit * 2,
    float: 'right'
  }
})

export const optionStyles = theme => ({
  root: {
    width: '100%'
  },
  paper: {
    width: '100%',
    marginTop: theme.spacing.unit
  },
  listItem: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
})

export const navStyles = (theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  flex: {
    flex: 1
  },
  extra: {
    display: 'flex',
    position: 'relative',
    'align-items': 'center'
  },
  rightIcon: {
    color: '#ffffff',
    marginLeft: 10
  },
  links: {
    'text-decoration': 'none',
    color: 'inherit'
  },
  navspan: {
    color: '#ffffff'
  },
  displayname: {
    color: '#ffffff',
    'margin-right': '20px',
    'font-family': '"Roboto", "Helvetica", "Arial", sans-serif',
    'font-size': '0.875rem',
    'font-weight': '400',
    'line-height': '1.46429em'
  },
  menuItem: {
    marginRight: 20
  },
  menuIcon: {
    marginRight: 20
  },
  menuAppbar: {
    top: 55
  }
})

export const dateStyles = theme => ({
  paper: {
    width: '100%',
    padding: theme.spacing.unit * 2
  },
  textField: {
    width: '100%'
  }
})

export const subQuestionStyles = theme => ({
  subStepContainer: {
    margin: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    float: 'right'
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2
  },
  resetContainer: {
    width: '100%',
    padding: theme.spacing.unit * 3
  }
})

export const textInputStyles = theme => ({
  paper: {
    width: '100%',
    padding: theme.spacing.unit * 2
  },
  textField: {
    width: '100%'
  }
})

const ITEM_HEIGHT = 48
export const selectInputStyles = theme => ({
  root: {
    flexGrow: 1,
    height: 250
  },
  chip: {
    margin: theme.spacing.unit / 4
  },
  '@global': {
    '.Select-control': {
      display: 'flex',
      alignItems: 'center',
      border: 0,
      height: 'auto',
      background: 'transparent',
      '&:hover': {
        boxShadow: 'none'
      }
    },
    '.Select-multi-value-wrapper': {
      flexGrow: 1,
      display: 'flex',
      flexWrap: 'wrap'
    },
    '.Select--multi .Select-input': {
      margin: 0
    },
    '.Select.has-value.is-clearable.Select--single > .Select-control .Select-value': {
      padding: 0
    },
    '.Select-noresults': {
      padding: theme.spacing.unit * 2
    },
    '.Select-input': {
      display: 'inline-flex !important',
      padding: 0,
      height: 'auto'
    },
    '.Select-input input': {
      background: 'transparent',
      border: 0,
      padding: 0,
      cursor: 'default',
      display: 'inline-block',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      margin: 0,
      outline: 0
    },
    '.Select-placeholder, .Select--single .Select-value': {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.pxToRem(16),
      padding: 0
    },
    '.Select-placeholder': {
      opacity: 0.42,
      color: theme.palette.common.black
    },
    '.Select-menu-outer': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      position: 'absolute',
      left: 0,
      top: `calc(100% + ${theme.spacing.unit}px)`,
      width: '100%',
      zIndex: 2,
      maxHeight: ITEM_HEIGHT * 4.5
    },
    '.Select.is-focused:not(.is-open) > .Select-control': {
      boxShadow: 'none'
    },
    '.Select-menu': {
      maxHeight: ITEM_HEIGHT * 4.5,
      overflowY: 'auto'
    },
    '.Select-menu div': {
      boxSizing: 'content-box'
    },
    '.Select-arrow-zone, .Select-clear-zone': {
      color: theme.palette.action.active,
      cursor: 'pointer',
      height: 21,
      width: 21,
      zIndex: 1
    },
    // Only for screen readers. We can't use display none.
    '.Select-aria-only': {
      position: 'absolute',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      height: 1,
      width: 1,
      margin: -1
    }
  }
})
