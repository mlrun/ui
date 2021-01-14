import React from 'react'
import PropTypes from 'prop-types'

import ArtifactInfoSources from '../ArtifactInfoSources/ArtifactInfoSources'
import DetailsInfoItem from '../../elements/DetailsInfoItem/DetailsInfoItem'

import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import {
  ARTIFACTS_PAGE,
  FEATURE_SETS_TAB,
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  MODELS_PAGE
} from '../../constants'
import { parseKeyValues } from '../../utils'

import { ReactComponent as RightArrow } from '../../images/ic_arrow-right.svg'

const DetailsInfoView = React.forwardRef(
  (
    {
      changes,
      content,
      detailsInfoState,
      handleFinishEdit,
      handleInfoItemClick,
      match,
      pageData,
      selectedItem,
      sources
    },
    ref
  ) => {
    return (
      !isEveryObjectValueEmpty(content) && (
        <div className="item-info">
          {(pageData.page === ARTIFACTS_PAGE ||
            pageData.page === FILES_PAGE ||
            pageData.page === MODELS_PAGE ||
            pageData.page === FEATURE_STORE_PAGE) &&
            match.params.pageTab !== FEATURE_SETS_TAB && (
              <h3 className="item-info__header">General</h3>
            )}
          <ul className="item-info__details">
            {pageData.infoHeaders?.map(header => {
              let chipsData = {
                chips: []
              }
              let chipsClassName = ''
              let func = ''
              let state = ''
              let info = null
              let target_path = null

              if (pageData.page === JOBS_PAGE) {
                chipsData.chips =
                  content[header.id]?.value === selectedItem.parameters
                    ? selectedItem.parameters
                    : content[header.id]?.value === selectedItem.resultsChips
                    ? selectedItem.resultsChips
                    : content[header.id]?.value === selectedItem.labels
                    ? selectedItem.labels
                    : []

                chipsClassName =
                  content[header.id]?.value === selectedItem.parameters
                    ? 'parameters'
                    : content[header.id]?.value === selectedItem.resultsChips
                    ? 'results'
                    : 'labels'
                func =
                  content[header.id]?.value === selectedItem.function
                    ? selectedItem.function
                    : ''
                state =
                  content[header.id]?.value === selectedItem.state
                    ? selectedItem.state
                    : ''
                info = content[header.id]?.value
              } else if (
                pageData.page === ARTIFACTS_PAGE ||
                pageData.page === FILES_PAGE ||
                pageData.page === MODELS_PAGE ||
                pageData.page === FEATURE_STORE_PAGE
              ) {
                chipsData = {
                  chips:
                    content[header.id]?.value === selectedItem.labels
                      ? changes.data[header.id]
                        ? changes.data[header.id]
                        : parseKeyValues(selectedItem.labels)
                      : content[header.id]?.value === selectedItem.relations
                      ? parseKeyValues(selectedItem.relations)
                      : [],
                  delimiter:
                    content[header.id]?.value === selectedItem.relations ? (
                      <RightArrow />
                    ) : null
                }
                chipsClassName = 'labels'
                info = changes.data[header.id]
                  ? changes.data[header.id]
                  : selectedItem && content[header.id]?.value
                target_path =
                  content[header.id]?.value === selectedItem.target_path
                    ? selectedItem.target_path
                    : {}

                if (content[header.id]?.value === selectedItem.sources) {
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
                    ? content[header.id]?.value || 'Local'
                    : content[header.id]?.value || ''
              }

              return (
                <li className="details-item" key={header.id}>
                  <div className="details-item__header">{header.label}</div>
                  <DetailsInfoItem
                    chipsClassName={chipsClassName}
                    chipsData={chipsData}
                    currentField={header.id}
                    currentFieldType={content[header.id]?.editModeType}
                    editableFieldType={detailsInfoState.editMode.fieldType}
                    func={func}
                    handleFinishEdit={handleFinishEdit}
                    info={info}
                    isEditModeEnabled={content[header.id]?.editModeEnabled}
                    isFieldInEditMode={
                      detailsInfoState.editMode.field === header.id
                    }
                    match={match}
                    onChange={content[header.id]?.onChange}
                    onClick={handleInfoItemClick}
                    ref={ref}
                    state={state}
                    target_path={target_path}
                  />
                </li>
              )
            })}
          </ul>
          {(pageData.page === ARTIFACTS_PAGE ||
            pageData.page === FILES_PAGE ||
            pageData.page === MODELS_PAGE ||
            pageData.page === FEATURE_STORE_PAGE) &&
            selectedItem.producer && (
              <>
                <h3 className="item-info__header">Producer</h3>
                <ul className="item-info__details">
                  {Object.keys(selectedItem.producer).map(header => {
                    let url = ''

                    if (header === 'uri') {
                      const [project, hash] = selectedItem.producer.uri.split(
                        '/'
                      )
                      url = `/projects/${project}/jobs/monitor/${hash}/overview`
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
    )
  }
)

DetailsInfoView.defaultProps = {
  sources: {}
}

DetailsInfoView.propTypes = {
  changes: PropTypes.shape({}).isRequired,
  content: PropTypes.shape({}).isRequired,
  detailsInfoState: PropTypes.shape({}).isRequired,
  handleFinishEdit: PropTypes.func.isRequired,
  handleInfoItemClick: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  pageData: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  sources: PropTypes.shape({})
}

export default DetailsInfoView
