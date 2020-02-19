import React from 'react'
import PropTypes from 'prop-types'

import { formatDatetime } from '../../utils'
import jobsData from '../JobsPage/jobsData'

import JobsDetailsInfoItem from '../../elements/JobsDetailsInfoItem/JobsDetailsInfoItem'

const DetailsInfo = ({ item, page }) => {
  const jobsInfoContent = [
    item.uid,
    formatDatetime(item.startTime),
    item.state,
    item.parameters,
    item.labels,
    item.logLevel,
    item.outputPath,
    item.iterations
  ]
  return (
    <div>
      <ul className="table__item_details">
        {page === 'jobs'
          ? jobsData.jobsInfoHeaders.map((header, i) => {
              if (jobsInfoContent[i] === item.state) {
                return (
                  <JobsDetailsInfoItem
                    state={item.state}
                    header={header}
                    key={header}
                  />
                )
              } else if (jobsInfoContent[i] === item.parameters) {
                return (
                  <JobsDetailsInfoItem
                    chips={item.parameters}
                    header={header}
                    key={header}
                  />
                )
              } else if (jobsInfoContent[i] === item.labels) {
                return (
                  <JobsDetailsInfoItem
                    chips={item.labels}
                    header={header}
                    key={header}
                  />
                )
              } else {
                return (
                  <JobsDetailsInfoItem
                    info={jobsInfoContent[i]}
                    header={header}
                    key={header}
                  />
                )
              }
            })
          : ''}
      </ul>
    </div>
  )
}

DetailsInfo.propTypes = {
  item: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired
}

export default DetailsInfo
