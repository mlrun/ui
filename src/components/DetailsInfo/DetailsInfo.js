import React from 'react'
import PropTypes from 'prop-types'

import { formatDatetime } from '../../utils'
import jobsData from '../JobsPage/jobsData'
import artifactsData from '../Artifacts/artifactsData'

import JobsDetailsInfoItem from '../../elements/JobsDetailsInfoItem/JobsDetailsInfoItem'
import ArtifactsDetailsInfoItem from '../../elements/ArtifactsDetailsInfoItem/ArtifactsDetailsInfoItem'

const DetailsInfo = ({ item, page, handleShowElements }) => {
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
  const artifactsInfoContent = [
    item.key,
    item.iter ? item.iter : 0,
    item.kind,
    item.size,
    item.target_path,
    item.tree,
    // formatDatetime(new Date(item.updated)),
    item.labels
  ]
  const artifactsProducerInfoContent = item.producer && [
    item.producer.kind,
    item.producer.name,
    item.producer.owner,
    item.producer.uri,
    item.producer.workflow
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
                    handleShowElements={handleShowElements}
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
                    handleShowElements={handleShowElements}
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
          : artifactsData.artifactsInfoHeaders.map((header, i) => {
              if (artifactsInfoContent[i] === item.labels) {
                return (
                  <ArtifactsDetailsInfoItem
                    chips={item.labels}
                    header={header}
                    key={header}
                    handleShowElements={handleShowElements}
                  />
                )
              } else if (artifactsInfoContent[i] === item.target_path) {
                return (
                  <ArtifactsDetailsInfoItem
                    target_path={item.target_path}
                    header={header}
                    key={header}
                    handleShowElements={handleShowElements}
                  />
                )
              } else {
                return (
                  <ArtifactsDetailsInfoItem
                    info={artifactsInfoContent[i]}
                    header={header}
                    key={header}
                  />
                )
              }
            })}
      </ul>
      {page === 'artifacts' && item.producer && (
        <>
          <h3 className="table__item_details_preview_header">Producer</h3>
          <ul className="table__item_details">
            {artifactsData.artifactsProducerInfoHeaders.map((header, i) => (
              <ArtifactsDetailsInfoItem
                info={artifactsProducerInfoContent[i]}
                header={header}
                key={header}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

DetailsInfo.defaultProps = {
  item: {
    producer: {}
  }
}

DetailsInfo.propTypes = {
  item: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired
}

export default DetailsInfo
