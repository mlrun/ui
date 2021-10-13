import React from 'react'
import PropTypes from 'prop-types'
import { capitalize, isNil } from 'lodash'
import classnames from 'classnames'

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
  MODELS_PAGE,
  MONITOR_JOBS_TAB
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
            {pageData.details.infoHeaders?.map(header => {
              let chipsData = {
                chips: [],
                chipOptions: {},
                delimiter: null
              }
              let chipsClassName = ''
              const detailsItemClassNames = classnames(
                'details-item',
                header.hidden && 'details-item_hidden'
              )
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
                  content[header.id]?.value === selectedItem.state?.value
                    ? selectedItem.state?.value
                    : ''
                info = content[header.id]?.value
              } else if (
                pageData.page === ARTIFACTS_PAGE ||
                pageData.page === FILES_PAGE ||
                pageData.page === MODELS_PAGE ||
                pageData.page === FEATURE_STORE_PAGE
              ) {
                if (header.id === 'labels') {
                  chipsData.chips = !isNil(changes.data[header.id])
                    ? changes.data[header.id].currentFieldValue
                    : parseKeyValues(content[header.id]?.value)
                  chipsData.chipOptions = getChipOptions(header.id)
                }
                if (header.id === 'metrics') {
                  chipsData.chips = parseKeyValues(content[header.id]?.value)
                  chipsData.chipOptions = getChipOptions(header.id)
                } else if (header.id === 'relations') {
                  chipsData.chips = parseKeyValues(content[header.id]?.value)
                  chipsData.chipOptions = getChipOptions(header.id)
                  chipsData.delimiter = <RightArrow />
                }

                info = !isNil(changes.data[header.id])
                  ? changes.data[header.id].currentFieldValue
                  : selectedItem && content[header.id]?.value
                target_path =
                  content[header.id]?.value === selectedItem.target_path
                    ? selectedItem.target_path
                    : ''
              } else if (pageData.page === FUNCTIONS_PAGE) {
                info =
                  header.id === 'kind'
                    ? content[header.id]?.value || 'Local'
                    : content[header.id]?.value || ''
              }

              return (
                <li className={detailsItemClassNames} key={header.id}>
                  {header.id === 'sources' ? (
                    <ArtifactInfoSources
                      header={header.label}
                      sources={sources}
                    />
                  ) : (
                    <>
                      <div className="details-item__header">
                        {header.label}
                        {header.tip && (
                          <Tip
                            className="details-item__tip"
                            text={header.tip}
                          />
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
                    </>
                  )}
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
                        url = `/projects/${project}/jobs/${MONITOR_JOBS_TAB}/${uid}/overview`
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
