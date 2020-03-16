import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import yaml from 'js-yaml'

import jobsActions from '../../actions/jobs'
import jobsData from './jobsData'
import createJobsContent from '../../utils/createJobsContent'
import { parseKeyValues } from '../../utils'

import Content from '../../layout/Content/Content'
import Loader from '../../common/Loader/Loader'

const Jobs = ({ fetchJobs, jobsStore, match, history }) => {
  const [convertedYaml, setConvertedYaml] = useState()

  const [jobs, setJobs] = useState([])
  const [tableContent, setTableContent] = useState([])
  const [selectedJob, setSelectedJob] = useState({})

  const [stateFilter, setStateFilter] = useState(jobsData.initialStateFilter)
  const [groupFilter, setGroupFilter] = useState(jobsData.initialGroupFilter)

  const [groupedByName, setGroupedByName] = useState({})
  const [expand, setExpand] = useState(false)
  const [expandedItems, setExpandedItems] = useState([])

  const groupLatestJob = tableContent.map(group => {
    if (Array.isArray(group)) {
      return group.reduce((prev, curr) => {
        return new Date(prev.updated.value).getTime() >
          new Date(curr.updated.value).getTime()
          ? prev
          : curr
      })
    } else return group
  })

  const refreshJobs = useCallback(() => {
    fetchJobs(
      match.params.projectName,
      stateFilter !== jobsData.initialStateFilter && stateFilter
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
  }, [fetchJobs, match.params.projectName, stateFilter])

  const createContent = useCallback(() => {
    let content = []
    if (jobs.length > 0) {
      content =
        Object.keys(groupedByName).length > 0
          ? Object.values(groupedByName).map(group => {
              return createJobsContent(group)
            })
          : createJobsContent(jobs)
    }
    setTableContent(content)
  }, [jobs, groupedByName])

  useEffect(() => {
    history.push(`/projects/${match.params.projectName}/jobs`)
    setSelectedJob({})

    if (expand) {
      setExpand(false)
    }

    refreshJobs()

    return () => {
      setSelectedJob({})
      setExpand(false)
      setJobs([])
    }
  }, [expand, history, match.params.projectName, refreshJobs])

  useEffect(() => {
    createContent()
    return () => {
      setTableContent([])
    }
  }, [createContent])

  useEffect(() => {
    if (match.params.jobId && Object.keys(selectedJob).length === 0) {
      let item = jobsStore.jobs.find(item => item.uid === match.params.jobId)

      setSelectedJob(item)
    }
  }, [selectedJob, match.params.jobId, setSelectedJob, jobsStore.jobs])

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
  }, [groupFilter, setGroupedByName, jobs])

  const handleSelectJob = item => {
    if (document.getElementsByClassName('view')[0]) {
      document.getElementsByClassName('view')[0].classList.remove('view')
    }
    setSelectedJob(item)
  }

  const handleCancel = () => {
    setSelectedJob({})
  }

  const convertToYaml = item => {
    document.getElementById('yaml_modal').style.display = 'flex'
    const jobJson = jobsStore.jobs.filter(job => job.metadata.uid === item.uid)
    setConvertedYaml(
      yaml.safeDump(jobJson, {
        lineWidth: 1000
      })
    )
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

  console.log('here')

  return (
    <>
      {jobsStore.loading && <Loader />}
      <Content
        content={jobs}
        convertToYaml={convertToYaml}
        convertedYaml={convertedYaml}
        detailsMenu={jobsData.detailsMenu}
        filters={jobsData.filters}
        groupFilter={groupFilter}
        groupLatestJob={groupLatestJob}
        setGroupFilter={setGroupFilter}
        handleCancel={handleCancel}
        handleSelectItem={handleSelectJob}
        match={match}
        page={jobsData.page}
        selectedItem={selectedJob}
        refresh={refreshJobs}
        tableHeaders={jobsData.tableHeaders}
        tableContent={tableContent}
        stateFilter={stateFilter}
        setStateFilter={setStateFilter}
        expand={expand}
        handleExpandRow={handleExpandRow}
        handleExpandAll={handleExpandAll}
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
