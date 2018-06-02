export const appStyles = theme => ({
  page: {
    backgroundColor: theme.palette.primary.main,
    height: `calc(80vh - ${theme.spacing.unit}px)`,
    padding: theme.spacing.unit
  }
})
export const questionStyles = theme => ({
  grid: {
    backgroundColor: theme.palette.primary.main,
    height: 'calc(80vh - 24px)',
    overflowY: 'scroll',
    marginBottom: theme.spacing.unit
  },
  questionGrid: {
    display: 'flex',
    flexGrow: 1,
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignContent: 'center',
    minHeight: '100%'
  },
  title: {
    textTransform: 'uppercase',
    width: '100%',
    padding: theme.spacing.unit,
    fontWeight: 900,
    textAlign: 'center',
    span: {
      color: '#fff'
    }
  },
  questionTitleGrid: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 3
  },
  question: {
    textAlign: 'center',
    fontWeight: '900',
    textTransform: 'uppercase'
  }
})

export const notificationsPagesStyles = theme => {
  const question = questionStyles(theme)
  return {
    grid: {
      ...question.grid,
      backgroundColor: theme.palette.background.paper
    },
    root: {
      flexGrow: 1
    },
    appFrame: {
      zIndex: 1,
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      width: '100%'
    },
    appBar: {
      position: 'absolute',
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    appBarShift: {
      width: `calc(100% - ${240}px)`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    'appBarShift-left': {
      marginLeft: 240
    },
    'appBarShift-right': {
      marginRight: 240
    },
    menuButton: {
      marginLeft: 12,
      marginRight: 20
    },
    hide: {
      display: 'none'
    },
    drawerPaper: {
      position: 'relative',
      height: 'calc(80vh - 25px)',
      overflowY: 'scroll',
      width: 240
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      ...theme.mixins.toolbar
    },
    content: {
      flexGrow: 1,
      height: 'calc(80vh - 25px)',
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing.unit,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    'content-left': {
      marginLeft: -240
    },
    'content-right': {
      marginRight: -240
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    'contentShift-left': {
      marginLeft: 0
    },
    'contentShift-right': {
      marginRight: 0
    }
  }
}

export const notificationStyles = theme => ({
  drawerContent: {
    height: 'calc(72vh - 8px)',
    marginTop: theme.spacing.unit,
    padding: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 3,
    overflowY: 'scroll',
    overflowX: 'hidden'
  },
  notice: theme.mixins.gutters({
    minWidth: 200,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  })
})

export const notificationSettingsStyles = theme => ({
  drawerContent: notificationStyles(theme).drawerContent
})

export const heroStyles = theme => ({
  hero: {
    backgroundColor: theme.palette.primary.main,
    height: 'calc(80vh - 15px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexFlow: 'row wrap'
  },
  heroText: {
    height: 'auto',
    padding: theme.spacing.unit * 2,
    maxWidth: '400px',
    flex: '1 16%'
  },
  heroBook: {
    height: '50vh',
    maxWidth: '400px',
    padding: theme.spacing.unit * 2,
    flex: '1 16%'
  },
  title: {
    ...theme.typography.headline,
    fontWeight: 900,
    color: '#FFFFFF'
  },
  subHeading: {
    ...theme.typography.subheading,
    color: '#FFFFFF'
  },
  cta: {

  }
})

export const recommendationsStyles = theme => {
  const question = questionStyles(theme)
  return {
    recomendationGrid: question.questionGrid
  }
}

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
  paper: {
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
  dateGrid: {
    backgroundColor: theme.palette.background.paper,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4
  }
})

export const subQuestionStyles = theme => ({
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    float: 'right'
  },
  actions: {
    marginBottom: theme.spacing.unit * 2
  },
  subQuestions: {
    backgroundColor: theme.palette.background.paper
  },
  subStepContainer: {
    padding: theme.spacing.unit
  }
})

export const textInputStyles = theme => ({
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
      zIndex: 999999,
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

export const scoreStyles = theme => ({
  expansion: {
    width: '100%'
  },
  actions: {
    display: 'flex'
  },
  share: {
    marginLeft: 'auto'
  },
  barWrapper: {
    top: 0,
    left: 350,
    lineHeight: 24
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    textTransform: 'uppercase',
    flexShrink: 0
  },
  subHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  notice: {
    fontSize: theme.typography.pxToRem(14),
    color: '#000000'
  },
  chip: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    color: '#FFFFFF'
  },
  expansionIcon: {
    marginBottom: -6,
    marginRight: 10
  },
  mapGrid: {
    minHeight: 200
  },
  map: {
    height: '100%',
    width: '100%',
    position: 'relative !important',
    paddingBottom: 20,
    minHeight: 200
  },
  progress: {
    margin: '0 auto'
  }
})

export const listRecommendationsStyles = theme => ({
  expansion: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    textTransform: 'uppercase',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  expansionIcon: {
    marginBottom: -6,
    marginRight: 10
  }
})
