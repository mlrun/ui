import React from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'lodash'
import classnames from 'classnames'

import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import {
  ARTIFACTS_PAGE,
  DATASETS_PAGE,
  FEATURE_SETS_TAB,
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  MODELS_PAGE
} from '../../constants'
import { parseKeyValues } from '../../utils'
import { getChipOptions } from '../../utils/getChipOptions'

import ArtifactInfoSources from '../ArtifactInfoSources/ArtifactInfoSources'
import DetailsInfoItem from '../../elements/DetailsInfoItem/DetailsInfoItem'
import { Tip } from 'igz-controls/components'
import { ReactComponent as RightArrow } from 'igz-controls/images/ic_arrow-right.svg'

const DetailsInfoView = React.forwardRef(
  (
    {
      detailsInfoDispatch,
      detailsInfoState,
      detailsStore,
      handleFinishEdit,
      handleInfoItemClick,
      pageData,
      params,
      selectedItem,
      setChangesData,
      sources
    },
    ref
  ) => {
    return (
      !isEveryObjectValueEmpty(detailsStore.infoContent) && (
        <div className="item-info">
          {(pageData.page === ARTIFACTS_PAGE ||
            pageData.page === DATASETS_PAGE ||
            pageData.page === FILES_PAGE ||
            pageData.page === MODELS_PAGE ||
            pageData.page === FEATURE_STORE_PAGE) &&
            params.pageTab !== FEATURE_SETS_TAB && <h3 className="item-info__header">General</h3>}
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
                if (detailsStore.infoContent[header.id]?.value === selectedItem.parameters) {
                  chipsData.chips = selectedItem.parameters
                  chipsData.chipOptions = getChipOptions('parameters')
                } else if (
                  detailsStore.infoContent[header.id]?.value === selectedItem.resultsChips
                ) {
                  chipsData.chips = selectedItem.resultsChips
                  chipsData.chipOptions = getChipOptions('results')
                } else if (detailsStore.infoContent[header.id]?.value === selectedItem.labels) {
                  chipsData.chips = selectedItem.labels
                  chipsData.chipOptions = getChipOptions('labels')
                }

                func =
                  detailsStore.infoContent[header.id]?.value === selectedItem.function
                    ? selectedItem.function
                    : ''
                state =
                  detailsStore.infoContent[header.id]?.value === selectedItem.state?.value
                    ? selectedItem.state?.value
                    : ''
                info = detailsStore.infoContent[header.id]?.value
              } else if (
                pageData.page === ARTIFACTS_PAGE ||
                pageData.page === DATASETS_PAGE ||
                pageData.page === FILES_PAGE ||
                pageData.page === MODELS_PAGE ||
                pageData.page === FEATURE_STORE_PAGE
              ) {
                if (header.id === 'labels') {
                  chipsData.chips = !isNil(detailsStore.changes.data[header.id])
                    ? detailsStore.changes.data[header.id].currentFieldValue
                    : parseKeyValues(detailsStore.infoContent[header.id]?.value)
                  chipsData.chipOptions = getChipOptions(header.id)
                }
                if (header.id === 'metrics') {
                  chipsData.chips = parseKeyValues(detailsStore.infoContent[header.id]?.value)
                  chipsData.chipOptions = getChipOptions(header.id)
                } else if (header.id === 'relations') {
                  chipsData.chips = parseKeyValues(detailsStore.infoContent[header.id]?.value)
                  chipsData.chipOptions = getChipOptions(header.id)
                  chipsData.delimiter = <RightArrow />
                }

                info = !isNil(detailsStore.changes.data[header.id])
                  ? detailsStore.changes.data[header.id].currentFieldValue
                  : selectedItem && detailsStore.infoContent[header.id]?.value
                target_path =
                  detailsStore.infoContent[header.id]?.value === selectedItem.target_path
                    ? selectedItem.target_path
                    : ''
              } else if (pageData.page === FUNCTIONS_PAGE) {
                info =
                  header.id === 'kind'
                    ? detailsStore.infoContent[header.id]?.value || 'Local'
                    : detailsStore.infoContent[header.id]?.value || ''
              }

              return (
                <li className={detailsItemClassNames} key={header.id}>
                  {header.id === 'sources' ? (
                    <ArtifactInfoSources header={header.label} sources={sources} />
                  ) : (
                    <>
                      <div className="details-item__header">
                        {header.label}
                        {header.tip && <Tip className="details-item__tip" text={header.tip} />}
                      </div>
                      <DetailsInfoItem
                        changesData={detailsStore.changes.data}
                        chipsClassName={chipsClassName}
                        chipsData={chipsData}
                        chipOptions={chipsData.chipOptions}
                        currentField={header.id}
                        detailsInfoDispatch={detailsInfoDispatch}
                        editableFieldType={detailsInfoState.editMode.fieldType}
                        func={func}
                        handleFinishEdit={handleFinishEdit}
                        info={info}
                        isFieldInEditMode={detailsInfoState.editMode.field === header.id}
                        item={detailsStore.infoContent[header.id]}
                        link={detailsStore.infoContent[header.id]?.link}
                        onClick={handleInfoItemClick}
                        params={params}
                        ref={ref}
                        setChangesData={setChangesData}
                        state={state}
                        target_path={target_path}
                      />
                    </>
                  )}
                </li>
              )
            })}
          </ul>
          {pageData.details.additionalInfo && !pageData.details.additionalInfo.hidden && (
            <>
              <h3 className="item-info__header">{pageData.details.additionalInfo.header}</h3>
              <ul className="item-info__details">{pageData.details.additionalInfo.body}</ul>
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
  detailsInfoDispatch: PropTypes.func.isRequired,
  detailsInfoState: PropTypes.shape({}).isRequired,
  detailsStore: PropTypes.shape({}).isRequired,
  handleFinishEdit: PropTypes.func.isRequired,
  handleInfoItemClick: PropTypes.func.isRequired,
  pageData: PropTypes.shape({}).isRequired,
  params: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  sources: PropTypes.shape({})
}

export default DetailsInfoView
