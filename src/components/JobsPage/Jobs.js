import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import jobsActions from '../../actions/jobs'
import jobsData from './jobsData'
import { parseKeyValues } from '../../utils'

import Content from '../../layout/Content/Content'
import Loader from '../../common/Loader/Loader'

const Jobs = ({ fetchJobs, jobsStore, match, history }) => {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState({})

  const [stateFilter, setStateFilter] = useState(jobsData.initialStateFilter)
  const [groupFilter, setGroupFilter] = useState(jobsData.initialGroupFilter)

  const [groupedByName, setGroupedByName] = useState({})
  const [expand, setExpand] = useState(false)
  const [expandedItems, setExpandedItems] = useState([])

  const refreshJobs = useCallback(
    event => {
      fetchJobs(
        match.params.projectName,
        stateFilter !== jobsData.initialStateFilter && stateFilter,
        event
      ).then(jobs => {
        const newJobs = jobs.map(job => ({
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
          outputPath: job.spec.output_path,
          owner: job.metadata.labels.owner,
          updated: new Date(job.status.last_update)
        }))
        return setJobs(newJobs)
      })
    },
    [fetchJobs, match.params.projectName, stateFilter]
  )

  useEffect(() => {
    refreshJobs()

    return () => {
      setSelectedJob({})
      setExpand(false)
      setJobs([])
    }
  }, [history, match.params.projectName, refreshJobs])

  useEffect(() => {
    if (match.params.jobId) {
      let item = jobs.find(item => item.uid === match.params.jobId)

      if (!item) {
        return history.push(`/projects/${match.params.projectName}/jobs`)
      }

      setSelectedJob(item)
    } else {
      setSelectedJob({})
    }
  }, [
    match.params.jobId,
    setSelectedJob,
    jobs,
    match.params.projectName,
    history
  ])

  useEffect(() => {
    if (groupFilter === 'Name') {
      const groupedJobs = {}

      jobs.forEach(job => {
        groupedJobs[job.name]
          ? groupedJobs[job.name].push(job)
          : (groupedJobs[job.name] = [job])
      })

      setGroupedByName(groupedJobs)
    } else if (groupFilter === jobsData.initialGroupFilter) {
      const rows = [...document.getElementsByClassName('parent-row')]

      rows.forEach(row => row.classList.remove('parent-row-expanded'))

      setExpand(false)
      setGroupedByName({})
    }

    return () => {
      setGroupedByName({})
    }
  }, [
    groupFilter,
    setGroupedByName,
    jobs,
    jobsStore.loading,
    history,
    match.params.projectName
  ])

  const handleSelectJob = item => {
    if (document.getElementsByClassName('view')[0]) {
      document.getElementsByClassName('view')[0].classList.remove('view')
    }
    setSelectedJob(item)
  }

  const handleCancel = () => {
    setSelectedJob({})
  }

  const handleExpandRow = (e, item) => {
    if (e.target.className === 'expand-arrow') {
      const parentRow = e.target.closest('.parent-row')
      if (parentRow.classList.contains('parent-row-expanded')) {
        const newArray = expandedItems.filter(
          expanded => expanded.name.value !== item.name.value
        )
        parentRow.classList.remove('parent-row-expanded')
        return setExpandedItems(newArray)
      } else {
        setExpandedItems([...expandedItems, item])
        parentRow.classList.remove('active')
        parentRow.classList.add('parent-row-expanded')
      }
    }
  }

  const handleExpandAll = () => {
    if (groupFilter === 'Name') {
      const rows = [...document.getElementsByClassName('parent-row')]
      if (expand) {
        setExpand(false)
        rows.forEach(row => row.classList.remove('parent-row-expanded'))
      } else {
        setExpand(true)
        rows.forEach(row => row.classList.add('parent-row-expanded'))
      }
    }
  }

  return (
    <>
      {jobsStore.loading && <Loader />}
      <Content
        content={jobs}
        detailsMenu={jobsData.detailsMenu}
        expand={expand}
        filters={jobsData.filters}
        groupFilter={groupFilter}
        groupedByName={groupedByName}
        handleCancel={handleCancel}
        handleExpandAll={handleExpandAll}
        handleExpandRow={handleExpandRow}
        handleSelectItem={handleSelectJob}
        loading={jobsStore.loading}
        match={match}
        page={jobsData.page}
        refresh={refreshJobs}
        selectedItem={selectedJob}
        setGroupFilter={setGroupFilter}
        setStateFilter={setStateFilter}
        stateFilter={stateFilter}
        tableHeaders={jobsData.tableHeaders}
        yamlContent={jobsStore.jobs}
      />
    </>
  )
}

Jobs.propTypes = {
  fetchJobs: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  jobsStore: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default connect(jobsStore => jobsStore, jobsActions)(React.memo(Jobs))
