import React from 'react'

import makeStyles from '@material-ui/core/styles/makeStyles'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import Refresh from 'mdi-material-ui/Refresh'

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0.5, 2)
  }
}))

const Artifacts = props => {
  const classes = useStyles()
  return (
    <header className={classes.header}>
      <Breadcrumbs aria-label="breadcrumb">
        <Typography color="inherit">Artifacts</Typography>
      </Breadcrumbs>
      <Tooltip title="Refresh">
        <IconButton>
          <Refresh />
        </IconButton>
      </Tooltip>
    </header>
  )
}

export default Artifacts
