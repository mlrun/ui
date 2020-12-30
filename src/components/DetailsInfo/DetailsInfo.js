import React from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'lodash'

import DetailsInfoItem from '../../elements/DetailsInfoItem/DetailsInfoItem'
import ArtifactInfoSources from '../ArtifactInfoSources/ArtifactInfoSources'

import { formatDatetime, parseKeyValues } from '../../utils'
import {
  JOBS_PAGE,
  ARTIFACTS_PAGE,
  ARTIFACTS_FILES_PAGE,
  FUNCTIONS_PAGE,
  ARTIFACTS_MODELS_PAGE,
  ARTIFACTS_FEATURE_STORE
} from '../../constants'

import './detailsInfo.scss'

const DetailsInfo = ({ match, pageData, selectedItem }) => {
  const jobsInfoContent = [
    selectedItem.uid,
    formatDatetime(selectedItem.startTime, 'Not yet started'),
    formatDatetime(selectedItem.updated, 'N/A'),
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
    selectedItem.hash ?? '',
    selectedItem.db_key,
    selectedItem.iter || '0',
    pageData.pageKind !== ARTIFACTS_FEATURE_STORE &&
    pageData.pageKind !== ARTIFACTS_FILES_PAGE
      ? selectedItem.kind || ' '
      : null,
    selectedItem.size ?? '',
    selectedItem.target_path,
    selectedItem.tree,
    formatDatetime(new Date(selectedItem.updated), 'N/A'),
    pageData.pageKind === ARTIFACTS_MODELS_PAGE
      ? selectedItem.framework ?? ''
      : null,
    selectedItem.labels ?? [],
    selectedItem.sources
  ].filter(content => !isNil(content))
  const functionsInfoContent = [
    selectedItem.name,
    selectedItem.type,
    selectedItem.hash,
    selectedItem.codeOrigin,
    formatDatetime(new Date(selectedItem.updated), 'N/A'),
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
      {pageData.page === ARTIFACTS_PAGE && (
        <h3 className="item-info__header">General</h3>
      )}
      <ul className="item-info__details">
        {pageData.infoHeaders?.map((header, index) => {
          let chips = []
          let chipsClassName = ''
          let func = ''
          let state = ''
          let info = null
          let target_path = null

          if (pageData.page === JOBS_PAGE) {
            chips =
              jobsInfoContent[index] === selectedItem.parameters
                ? selectedItem.parameters
                : jobsInfoContent[index] === selectedItem.resultsChips
                ? selectedItem.resultsChips
                : jobsInfoContent[index] === selectedItem.labels
                ? selectedItem.labels
                : []
            chipsClassName =
              jobsInfoContent[index] === selectedItem.parameters
                ? 'parameters'
                : jobsInfoContent[index] === selectedItem.resultsChips
                ? 'results'
                : 'labels'
            func =
              jobsInfoContent[index] === selectedItem.function
                ? selectedItem.function
                : ''
            state =
              jobsInfoContent[index] === selectedItem.state
                ? selectedItem.state
                : ''
            info = jobsInfoContent[index]
          } else if (pageData.page === ARTIFACTS_PAGE) {
            chips =
              artifactsInfoContent[index] === selectedItem.labels
                ? parseKeyValues(selectedItem.labels)
                : []
            chipsClassName = 'labels'
            info = artifactsInfoContent[index]
            target_path =
              artifactsInfoContent[index] === selectedItem.target_path
                ? selectedItem.target_path
                : {}

            if (artifactsInfoContent[index] === selectedItem.sources) {
              return (
                <ArtifactInfoSources
                  sources={sources}
                  header={header.label}
                  key={header.id}
                />
              )
            }
          } else if (pageData.page === FUNCTIONS_PAGE) {
            info =
              header.id === 'kind'
                ? functionsInfoContent[index] || 'Local'
                : functionsInfoContent[index] || ''
          }

          return (
            <li className="details-item" key={header.id}>
              <div className="details-item__header">{header.label}</div>
              <DetailsInfoItem
                chips={chips}
                chipsClassName={chipsClassName}
                func={func}
                match={match}
                state={state}
                target_path={target_path}
                info={info}
              />
            </li>
          )
        })}
      </ul>
      {pageData.page === ARTIFACTS_PAGE && selectedItem.producer && (
        <>
          <h3 className="item-info__header">Producer</h3>
          <ul className="item-info__details">
            {Object.keys(selectedItem.producer).map(header => {
              let url = ''

              if (header === 'uri') {
                const [project, hash] = selectedItem.producer.uri.split('/')
                url = `/projects/${project}/jobs/monitor/${hash}/info`
              }

              return (
                <li className="details-item" key={header}>
                  <div className="details-item__header">{header}</div>
                  <DetailsInfoItem
                    link={url}
                    info={selectedItem.producer[header]}
                    page={pageData.page}
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

DetailsInfo.propTypes = {
  match: PropTypes.shape({}).isRequired,
  pageData: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default DetailsInfo
