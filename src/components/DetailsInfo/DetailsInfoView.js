import React from 'react'
import PropTypes from 'prop-types'
import { capitalize } from 'lodash'

import ArtifactInfoSources from '../ArtifactInfoSources/ArtifactInfoSources'
import DetailsInfoItem from '../../elements/DetailsInfoItem/DetailsInfoItem'
import Tip from '../../common/Tip/Tip'

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
import { getChipOptions } from '../../utils/getChipOptions'

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
                chips: [],
                chipOptions: {},
                delimiter: null
              }
              let chipsClassName = ''
              let func = ''
              let state = ''
              let info = null
              let target_path = null

              if (pageData.page === JOBS_PAGE) {
                if (content[header.id]?.value === selectedItem.parameters) {
                  chipsData.chips = selectedItem.parameters
                  chipsData.chipOptions = getChipOptions('parameters')
                } else if (
                  content[header.id]?.value === selectedItem.resultsChips
                ) {
                  chipsData.chips = selectedItem.resultsChips
                  chipsData.chipOptions = getChipOptions('results')
                } else if (content[header.id]?.value === selectedItem.labels) {
                  chipsData.chips = selectedItem.labels
                  chipsData.chipOptions = getChipOptions('labels')
                }

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
                if (content[header.id]?.value === selectedItem.labels) {
                  chipsData.chips = changes.data[header.id]
                    ? changes.data[header.id]
                    : parseKeyValues(selectedItem.labels)
                  chipsData.chipOptions = getChipOptions('labels')
                } else if (content[header.id]?.value === selectedItem.metrics) {
                  chipsData.chips = parseKeyValues(selectedItem.metrics)
                  chipsData.chipOptions = getChipOptions('metrics')
                } else if (
                  content[header.id]?.value === selectedItem.relations
                ) {
                  chipsData.chips = parseKeyValues(selectedItem.relations)
                  chipsData.chipOptions = getChipOptions('relations')
                  chipsData.delimiter = <RightArrow />
                }

                info = changes.data[header.id]
                  ? changes.data[header.id]
                  : selectedItem && content[header.id]?.value
                target_path =
                  content[header.id]?.value === selectedItem.target_path
                    ? selectedItem.target_path
                    : ''

                if (header.id === 'sources') {
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
                  <div className="details-item__header">
                    {header.label}
                    {header.tip && (
                      <Tip className="details-item__tip" text={header.tip} />
                    )}
                  </div>
                  <DetailsInfoItem
                    chipsClassName={chipsClassName}
                    chipsData={chipsData}
                    chipOptions={chipsData.chipOptions}
                    currentField={header.id}
                    editableFieldType={detailsInfoState.editMode.fieldType}
                    func={func}
                    handleFinishEdit={handleFinishEdit}
                    info={info}
                    isFieldInEditMode={
                      detailsInfoState.editMode.field === header.id
                    }
                    link={content[header.id]?.link}
                    match={match}
                    onClick={handleInfoItemClick}
                    ref={ref}
                    state={state}
                    target_path={target_path}
                    item={content[header.id]}
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
                  {Object.entries(selectedItem.producer).map(([key, value]) => {
                    let url = ''

                    if (key === 'uri') {
                      // value is in the form of: project/uid-iteration
                      const [project, rest] = value.split('/')
                      const [uid] = rest?.split('-') ?? []
                      if (uid) {
                        url = `/projects/${project}/jobs/monitor/${uid}/overview`
                      }
                    }

                    return (
                      <li className="details-item" key={key}>
                        <div className="details-item__header">
                          {capitalize(key)}
                        </div>
                        <DetailsInfoItem link={url} info={value} />
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
