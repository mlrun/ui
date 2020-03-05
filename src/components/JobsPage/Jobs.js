import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import yaml from 'js-yaml'

import jobsActions from '../../actions/jobs'
import jobsData from './jobsData'
import createJobsContent from '../../utils/createJobsContent'

import Content from '../../layout/Content/Content'

const Jobs = ({ fetchJobs, jobsStore, match, setSelectedJob, history }) => {
  const [convertedYaml, setConvertedYaml] = useState()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [stateFilter, setStateFilter] = useState(jobsData.initialStateFilter)
  const [groupFilter, setGroupFilter] = useState(jobsData.initialGroupFilter)
  const [groupedByName, setGroupedByName] = useState({})
  const [expand, setExpand] = useState(false)
  const [expandedItems, setExpandedItems] = useState([])

  const tableContent =
    Object.keys(groupedByName).length > 0
      ? Object.values(groupedByName).map(group => {
          return createJobsContent(group)
        })
      : createJobsContent(jobs)

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
    setJobs([])
    setExpand(false)
    setLoading(true)
    setSelectedJob({})

    history.push(`/projects/${match.params.projectName}/jobs`)

    fetchJobs(
      match.params.projectName,
      stateFilter !== jobsData.initialStateFilter ? stateFilter : false
    )
      .then(jobs => {
        return setJobs(jobs)
      })
      .then(() => setLoading(false))
  }, [
    fetchJobs,
    history,
    match.params.projectName,
    setSelectedJob,
    stateFilter
  ])

  useEffect(() => {
    refreshJobs()
  }, [refreshJobs])

  useEffect(() => {
    if (match.params.jobId) {
      let item = jobsStore.jobs.find(item => item.uid === match.params.jobId)

      setSelectedJob(item)
    }
  }, [jobsStore.jobs, match.params, setSelectedJob])

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
    const jobJson = jobsStore.jobsData.filter(
      job => job.metadata.uid === item.uid
    )
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

  return (
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
      loading={loading}
      match={match}
      page={jobsData.page}
      selectedItem={jobsStore.selectedJob}
      refresh={refreshJobs}
      tableHeaders={jobsData.tableHeaders}
      tableContent={tableContent}
      stateFilter={stateFilter}
      setStateFilter={setStateFilter}
      expand={expand}
      handleExpandRow={handleExpandRow}
      handleExpandAll={handleExpandAll}
    />
  )
}

Jobs.propTypes = {
  fetchJobs: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  jobsStore: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  setSelectedJob: PropTypes.func.isRequired
}

export default connect(jobsStore => jobsStore, jobsActions)(Jobs)
