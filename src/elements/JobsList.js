import React from 'react'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Typography from '@material-ui/core/Typography'

import State from '../common/State'
import { formatDatetime } from '../utils/datetime'

const JobsList = props => (
  <List>
    {props.jobs.map(job => {
      const Secondary = () => (
        <>
          <Typography component="span" variant="body2">
            {job.uid}
            <br />
            {formatDatetime(job.startTime)}
          </Typography>
        </>
      )
      return (
        <ListItem key={job.uid} selected={job.uid === props.jobId}>
          <ListItemText primary={job.name} secondary={<Secondary />} />
          <ListItemSecondaryAction>
            <State state={job.state} />
            <Typography variant="caption" component="p">
              Iterations {job.iterations.length}
            </Typography>
          </ListItemSecondaryAction>
        </ListItem>
      )
    })}
  </List>
)

export default JobsList
