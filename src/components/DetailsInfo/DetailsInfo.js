import React from 'react'
import PropTypes from 'prop-types'

import DetailsInfoItem from '../../elements/DetailsInfoItem/DetailsInfoItem'
import ArtifactInfoSources from '../ArtifactInfoSources/ArtifactInfoSources'

import { formatDatetime, parseKeyValues } from '../../utils'
import jobsData from '../JobsPage/jobsData'
import artifactsData from '../Artifacts/artifactsData'
import functionsData from '../FunctionsPage/functionsData'
import { JOBS_PAGE, ARTIFACTS_PAGE } from '../../constants'

import './detailsInfo.scss'

const DetailsInfo = ({ match, page, selectedItem }) => {
  const jobsInfoContent = [
    selectedItem.uid,
    formatDatetime(selectedItem.startTime),
    selectedItem.state,
    selectedItem.parameters,
    selectedItem.function,
    selectedItem.resultsChips,
    selectedItem.labels,
    selectedItem.logLevel,
    selectedItem.outputPath,
    selectedItem.iterations?.length ? selectedItem.iterations : '0'
  ]
  const artifactsInfoContent = [
    selectedItem.db_key,
    selectedItem.iter || '0',
    selectedItem.kind,
    selectedItem.size,
    selectedItem.target_path,
    selectedItem.tree,
    selectedItem.updated && formatDatetime(new Date(selectedItem.updated)),
    selectedItem.labels,
    selectedItem.sources
  ]
  const functionsInfoContent = [
    selectedItem.name,
    selectedItem.type,
    selectedItem.hash,
    formatDatetime(new Date(selectedItem.updated)),
    selectedItem.command,
    selectedItem.image,
    selectedItem.description,
    selectedItem.state
  ]
  const sources = Array.isArray(selectedItem.sources)
    ? selectedItem.sources.reduce((prev, cur) => {
        let source = {}
        source[cur.name] = cur.path

        return { ...prev, ...source }
      }, {})
    : selectedItem.sources

  return (
    <div className="item-info">
      {page === ARTIFACTS_PAGE && (
        <h3 className="item-info__header">General</h3>
      )}
      <ul className="item-info__details">
        {page === JOBS_PAGE
          ? jobsData.jobsInfoHeaders.map((header, index) => {
              return (
                <li className="details-item" key={header.id}>
                  <div className="details-item__header">{header.label}</div>
                  <DetailsInfoItem
                    chips={
                      jobsInfoContent[index] === selectedItem.parameters
                        ? selectedItem.parameters
                        : jobsInfoContent[index] === selectedItem.resultsChips
                        ? selectedItem.resultsChips
                        : jobsInfoContent[index] === selectedItem.labels
                        ? selectedItem.labels
                        : []
                    }
                    chipsClassName={
                      jobsInfoContent[index] === selectedItem.parameters
                        ? 'parameters'
                        : jobsInfoContent[index] === selectedItem.resultsChips
                        ? 'results'
                        : 'labels'
                    }
                    func={
                      jobsInfoContent[index] === selectedItem.function
                        ? selectedItem.function
                        : ''
                    }
                    match={match}
                    state={
                      jobsInfoContent[index] === selectedItem.state
                        ? selectedItem.state
                        : ''
                    }
                    info={jobsInfoContent[index]}
                  />
                </li>
              )
            })
          : page === ARTIFACTS_PAGE
          ? artifactsData.artifactsInfoHeaders.map((header, index) => {
              if (artifactsInfoContent[index] === selectedItem.sources) {
                return (
                  <ArtifactInfoSources
                    sources={sources}
                    header={header.label}
                    key={header.id}
                  />
                )
              }
              return (
                <li className="details-item" key={header.id}>
                  <div className="details-item__header">{header.label}</div>
                  <DetailsInfoItem
                    chips={
                      artifactsInfoContent[index] === selectedItem.labels
                        ? parseKeyValues(selectedItem.labels)
                        : []
                    }
                    chipsClassName="labels"
                    target_path={
                      artifactsInfoContent[index] === selectedItem.target_path
                        ? selectedItem.target_path
                        : {}
                    }
                    info={artifactsInfoContent[index]}
                  />
                </li>
              )
            })
          : functionsData.functionsInfoHeaders.map((header, index) => {
              return (
                <li className="details-item" key={header.id}>
                  <div className="details-item__header">{header.label}</div>
                  <DetailsInfoItem
                    info={
                      header.id === 'kind'
                        ? functionsInfoContent[index] || 'Local'
                        : functionsInfoContent[index] || ''
                    }
                  />
                </li>
              )
            })}
      </ul>
      {page === ARTIFACTS_PAGE && selectedItem.producer && (
        <>
          <h3 className="item-info__header">Producer</h3>
          <ul className="item-info__details">
            {Object.keys(selectedItem.producer).map(header => {
              let url = ''

              if (header === 'uri') {
                const [project, hash] = selectedItem.producer.uri.split('/')
                url = `/projects/${project}/jobs/${hash}/info`
              }

              return (
                <li className="details-item" key={header}>
                  <div className="details-item__header">{header}</div>
                  <DetailsInfoItem
                    link={url}
                    info={selectedItem.producer[header]}
                    page={page}
                  />
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}

DetailsInfo.defaultProps = {
  selectedItem: {}
}

DetailsInfo.propTypes = {
  match: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default DetailsInfo
