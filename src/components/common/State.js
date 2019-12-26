import React from 'react'

import blue from '@material-ui/core/colors/blue'
import deepPurple from '@material-ui/core/colors/deepPurple'
import green from '@material-ui/core/colors/green'
import grey from '@material-ui/core/colors/grey'
import lightBlue from '@material-ui/core/colors/lightBlue'
import orange from '@material-ui/core/colors/orange'
import red from '@material-ui/core/colors/red'
import Tooltip from '@material-ui/core/Tooltip'

import AlertCircleIcon from 'mdi-material-ui/AlertCircle'
import CalendarClockIcon from 'mdi-material-ui/CalendarClock'
import CheckCircleIcon from 'mdi-material-ui/CheckCircle'
import CloseCircleIcon from 'mdi-material-ui/CloseCircle'
import CogClockwiseIcon from 'mdi-material-ui/CogClockwise'
import PlayCircleIcon from 'mdi-material-ui/PlayCircle'
import SendClockIcon from 'mdi-material-ui/SendClock'

import { capitalize } from 'lodash'

const ICON_SIZE = 16

const stateIcons = {
  build: (
    <CogClockwiseIcon
      fontSize="small"
      style={{ color: orange[500], fontSize: ICON_SIZE }}
    />
  ),
  canceled: (
    <CloseCircleIcon
      fontSize="small"
      style={{ color: deepPurple[500], fontSize: ICON_SIZE }}
    />
  ),
  completed: (
    <CheckCircleIcon
      fontSize="small"
      style={{ color: green[600], fontSize: ICON_SIZE }}
    />
  ),
  error: (
    <AlertCircleIcon
      fontSize="small"
      style={{ color: red[500], fontSize: ICON_SIZE }}
    />
  ),
  failed: (
    <AlertCircleIcon
      fontSize="small"
      style={{ color: red[500], fontSize: ICON_SIZE }}
    />
  ),
  pending: (
    <SendClockIcon
      fontSize="small"
      style={{ color: grey[500], fontSize: ICON_SIZE }}
    />
  ),
  running: (
    <PlayCircleIcon
      fontSize="small"
      style={{ color: lightBlue[500], fontSize: ICON_SIZE }}
    />
  ),
  scheduled: (
    <CalendarClockIcon
      fontSize="small"
      style={{ color: blue[500], fontSize: ICON_SIZE }}
    />
  )
}

const State = props => (
  <Tooltip title={capitalize(props.state)}>{stateIcons[props.state]}</Tooltip>
)

export default State
