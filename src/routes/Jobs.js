import React, { useCallback, useEffect, useState } from 'react'

import { Route } from 'react-router-dom'

import makeStyles from '@material-ui/core/styles/makeStyles'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

import Refresh from 'mdi-material-ui/Refresh'

import Breadcrumbs from '../components/common/Breadcrumbs'
import JobDetails from '../components/Jobs/JobDetails'
import JobsTable from '../components/Jobs/JobsTable'
import JobsList from '../components/Jobs/JobsList'
import httpClient from '../httpClient'

import { parseKeyValues } from '../utils/object'

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0.5, 2)
  }
}))

const Jobs = props => {
  const classes = useStyles()
  const jobId = props.match.params && props.match.params.jobId

  const [loading, setLoading] = useState(false)
  const [jobs, setJobs] = useState([])

  const refreshJobs = useCallback(
    noCahche => {
      if (noCahche || jobs.length === 0) {
        setLoading(true)
        httpClient
          .get('/runs')
          .then(result => {
            const newJobs = (result.data || {}).runs
              .filter(job => job.metadata.iteration === 0)
              .map(job => ({
                uid: job.metadata.uid,
                iteration: job.metadata.iteration,
                iterationStats: job.status.iterations || [],
                iterations: [],
                startTime: new Date(job.status.start_time),
                state: job.status.state,
                name: job.metadata.name,
                labels: parseKeyValues(job.metadata.labels || {}),
                logLevel: job.spec.log_level,
                inputs: job.spec.inputs || {},
                parameters: parseKeyValues(job.spec.parameters || {}),
                results: job.status.results || {},
                resultsChips: parseKeyValues(job.status.results || {}),
                artifacts: job.status.artifacts || [],
                outputPath: job.spec.output_path
              }))
            setJobs(newJobs)
          })
          .catch(error => console.error(error))
          .finally(() => {
            setLoading(false)
          })
      }
    },
    [jobs.length]
  )

  useEffect(() => {
    refreshJobs()
  }, [refreshJobs])

  return (
    <>
      <header className={classes.header}>
        <Breadcrumbs match={props.match} />
        <Tooltip title="Refresh">
          <IconButton onClick={() => refreshJobs(true)}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </header>
      {jobId ? (
        <JobsList jobs={jobs} loading={loading} jobId={jobId} />
      ) : (
        <JobsTable jobs={jobs} loading={loading} />
      )}
      <Route
        path="/jobs/:jobId"
        render={routeProps => <JobDetails {...routeProps} />}
      />
    </>
  )
}

export default Jobs
