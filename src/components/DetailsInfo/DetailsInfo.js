import React from 'react'
import PropTypes from 'prop-types'

import { formatDatetime, parseKeyValues } from '../../utils'
import jobsData from '../JobsPage/jobsData'
import artifactsData from '../Artifacts/artifactsData'
import functionsData from '../FunctionsPage/functionsData'
import { JOBS_PAGE, ARTIFACTS_PAGE } from '../../constants'

import JobsDetailsInfoItem from '../../elements/JobsDetailsInfoItem/JobsDetailsInfoItem'
import ArtifactsDetailsInfoItem from '../../elements/ArtifactsDetailsInfoItem/ArtifactsDetailsInfoItem'
import ArtifactInfoSources from '../ArtifactInfoSources/ArtifactInfoSources'

import './detailsInfo.scss'

const DetailsInfo = ({ item, handleShowElements, page }) => {
  const jobsInfoContent = [
    item.uid,
    formatDatetime(item.startTime),
    item.state,
    item.parameters,
    item.resultsChips,
    item.labels,
    item.logLevel,
    item.outputPath,
    item.iterations && item.iterations.length ? item.iterations : '0'
  ]
  const artifactsInfoContent = [
    item.key,
    item.iter ? item.iter : '0',
    item.kind,
    item.size,
    item.target_path,
    item.tree,
    item.updated && formatDatetime(new Date(item.updated)),
    item.labels,
    item.sources
  ]
  const artifactsProducerInfoContent = item.producer && [
    item.producer.kind,
    item.producer.name,
    item.producer.owner,
    item.producer.uri,
    item.producer.workflow
  ]
  const functionsInfoContent = [
    item.name,
    item.kind,
    item.hash,
    formatDatetime(new Date(item.updated)),
    item.command,
    item.image,
    item.description,
    item.status
  ]

  return (
    <div>
      {page === 'artifacts' && (
        <h3 className="table__item_details_preview_header">General</h3>
      )}
      <ul className="table__item_details">
        {page === JOBS_PAGE
          ? jobsData.jobsInfoHeaders.map((header, i) => {
              switch (jobsInfoContent[i]) {
                case item.state:
                  return (
                    <JobsDetailsInfoItem
                      key={header}
                      handleShowElements={handleShowElements}
                      header={header}
                      state={item.state}
                    />
                  )
                case item.parameters:
                  return (
                    <JobsDetailsInfoItem
                      key={header}
                      chips={item.parameters}
                      header={header}
                      handleShowElements={handleShowElements}
                      chipsClassName="parameters"
                    />
                  )
                case item.resultsChips:
                  return (
                    <JobsDetailsInfoItem
                      key={header}
                      chips={item.resultsChips}
                      header={header}
                      handleShowElements={handleShowElements}
                      chipsClassName="results"
                    />
                  )
                case item.labels:
                  return (
                    <JobsDetailsInfoItem
                      key={header}
                      chips={item.labels}
                      header={header}
                      handleShowElements={handleShowElements}
                      chipsClassName="labels"
                    />
                  )
                default:
                  return (
                    <JobsDetailsInfoItem
                      key={header}
                      header={header}
                      info={jobsInfoContent[i]}
                    />
                  )
              }
            })
          : page === ARTIFACTS_PAGE
          ? artifactsData.artifactsInfoHeaders.map((header, i) => {
              switch (artifactsInfoContent[i]) {
                case item.labels:
                  return (
                    <ArtifactsDetailsInfoItem
                      key={header}
                      page={page}
                      handleShowElements={handleShowElements}
                      chips={parseKeyValues(item.labels)}
                      header={header}
                      chipsClassName="labels"
                    />
                  )
                case item.target_path:
                  return (
                    <ArtifactsDetailsInfoItem
                      key={header}
                      page={page}
                      handleShowElements={handleShowElements}
                      header={header}
                      target_path={item.target_path}
                    />
                  )
                case item.sources: {
                  return (
                    <ArtifactInfoSources
                      key={header}
                      header={header}
                      sources={
                        Array.isArray(item.sources)
                          ? item.sources.reduce((prev, cur) => {
                              let source = {}
                              source[cur.name] = cur.path
                              return { ...prev, ...source }
                            }, {})
                          : item.sources
                      }
                    />
                  )
                }
                default:
                  return (
                    <ArtifactsDetailsInfoItem
                      key={header}
                      page={page}
                      info={artifactsInfoContent[i]}
                      header={header}
                    />
                  )
              }
            })
          : functionsData.functionsInfoHeaders.map((header, i) => {
              return (
                <li className="table__item_details_item" key={i}>
                  <div className="table__item_details_item_header">
                    {header}
                  </div>
                  <div className="table__item_details_item_data">
                    {functionsInfoContent[i] || ''}
                  </div>
                </li>
              )
            })}
      </ul>
      {page === ARTIFACTS_PAGE && item.producer && (
        <>
          <h3 className="table__item_details_preview_header">Producer</h3>
          <ul className="table__item_details">
            {artifactsData.artifactsProducerInfoHeaders.map((header, i) => (
              <ArtifactsDetailsInfoItem
                key={header}
                page={page}
                info={artifactsProducerInfoContent[i]}
                header={header}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

DetailsInfo.defaultProps = {
  item: {}
}

DetailsInfo.propTypes = {
  handleShowElements: PropTypes.func.isRequired,
  item: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired
}

export default DetailsInfo
