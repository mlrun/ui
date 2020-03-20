import React from 'react'
import PropTypes from 'prop-types'

import { formatDatetime, parseKeyValues } from '../../utils'
import jobsData from '../JobsPage/jobsData'
import artifactsData from '../Artifacts/artifactsData'

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

  return (
    <div>
      {page === 'artifacts' && (
        <h3 className="table__item_details_preview_header">General</h3>
      )}
      <ul className="table__item_details">
        {page === 'jobs'
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
          : artifactsData.artifactsInfoHeaders.map((header, i) => {
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
            })}
      </ul>
      {page === 'artifacts' && item.producer && (
        <>
          <h3 className="table__item_details_preview_header">Producer</h3>
          <ul className="table__item_details">
            {Object.keys(item.producer).map(key => {
              return (
                <ArtifactsDetailsInfoItem
                  key={key}
                  page={page}
                  info={item.producer[key]}
                  header={key}
                />
              )
            })}
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
