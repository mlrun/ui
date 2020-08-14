import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import ProjectDataCard from '../../elements/ProjectDataCard/ProjectDataCard'
import { getJobsStatistics, getJobsTableData } from './projectJobs.utils'

const ProjectJobs = ({ match, jobs, fetchProjectJobs }) => {
  useEffect(() => {
    fetchProjectJobs(match.params.projectName)
  }, [match.params.projectName, fetchProjectJobs])

  const jobsData = React.useMemo(() => {
    const statistics = getJobsStatistics(jobs, match)
    const table = getJobsTableData(jobs, match)

    return {
      statistics,
      table
    }
  }, [jobs, match])

  return (
    <ProjectDataCard
      dataCard={jobs}
      link={`/projects/${match.params.projectName}/jobs/monitor`}
      match={match}
      statistics={jobsData.statistics}
      table={jobsData.table}
    />
  )
}

ProjectJobs.propTypes = {
  fetchProjectJobs: PropTypes.func.isRequired,
  jobs: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default React.memo(ProjectJobs)
