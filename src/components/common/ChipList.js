import React from 'react'

import makeStyles from '@material-ui/core/styles/makeStyles'
import Chip from '@material-ui/core/Chip'

import CheckCircleIcon from 'mdi-material-ui/CheckCircle'
import LabelIcon from 'mdi-material-ui/Label'
import TuneIcon from 'mdi-material-ui/Tune'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexFlow: 'row wrap',
    '& > *': {
      margin: theme.spacing(0.5),
      borderRadius: '4px'
    }
  }
}))

const icons = {
  labels: <LabelIcon />,
  parameters: <TuneIcon />,
  results: <CheckCircleIcon />
}

const ChipList = props => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      {props.list.map((item, index) => (
        <Chip
          key={index}
          label={item}
          icon={icons[props.type] || icons.label}
          size="small"
        />
      ))}
    </div>
  )
}

export default ChipList
