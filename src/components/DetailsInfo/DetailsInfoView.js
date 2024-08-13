/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'lodash'
import classnames from 'classnames'

import ArtifactInfoSources from '../ArtifactInfoSources/ArtifactInfoSources'
import DetailsInfoItem from '../../elements/DetailsInfoItem/DetailsInfoItem'
import { Tip } from 'igz-controls/components'

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

import { ReactComponent as RightArrow } from 'igz-controls/images/ic_arrow-right.svg'

import './detailsInfo.scss'

const DetailsInfoView = React.forwardRef(
  (
    {
      additionalInfo = {
        drift: [],
        producer: [],
        sources: {}
      },
      detailsInfoDispatch,
      detailsInfoState,
      detailsStore,
      formState,
      handleDiscardChanges,
      handleFinishEdit,
      handleInfoItemClick,
      pageData,
      params,
      selectedItem,
      setChangesData
    },
    ref
  ) => {
    const wrapperClassNames = classnames(
      !isEveryObjectValueEmpty(additionalInfo)
        ? 'item-info__details-wrapper'
        : 'item-info__full-width'
    )

    return (
      !isEveryObjectValueEmpty(detailsStore.infoContent) && (
        <>
          <div className="item-info__details-wrapper">
            {(pageData.page === ARTIFACTS_PAGE ||
              pageData.page === DATASETS_PAGE ||
              pageData.page === FILES_PAGE ||
              pageData.page === FUNCTIONS_PAGE ||
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

                if (pageData.page === JOBS_PAGE) {
                  if (detailsStore.infoContent[header.id]?.value === selectedItem.parametersChips) {
                    chipsData.chips = selectedItem.parametersChips
                    chipsData.chipOptions = getChipOptions('parameters')
                  } else if (
                    detailsStore.infoContent[header.id]?.value === selectedItem.resultsChips
                  ) {
                    chipsData.chips = selectedItem.resultsChips
                    chipsData.chipOptions = getChipOptions('results')
                  } else if (detailsStore.infoContent[header.id]?.value === selectedItem.labels) {
                    chipsData.chips = selectedItem.labels
                    chipsData.chipOptions = getChipOptions('labels')
                  } else if (
                    detailsStore.infoContent[header.id]?.value === selectedItem.nodeSelectorChips
                  ) {
                    chipsData.chips = selectedItem.nodeSelectorChips
                    chipsData.chipOptions = getChipOptions('results')
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
                    chipsData.chips = formState.values.labels
                      ? parseKeyValues(formState.values.labels)
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
                } else if (pageData.page === FUNCTIONS_PAGE) {
                  info =
                    header.id === 'kind'
                      ? detailsStore.infoContent[header.id]?.value || 'Local'
                      : detailsStore.infoContent[header.id]?.value || ''
                }

                return (
                  <li className={detailsItemClassNames} key={header.id}>
                    <>
                      <div className="details-item__header">
                        {header.label}:
                        {header.tip && <Tip className="details-item__tip" text={header.tip} />}
                      </div>
                      <DetailsInfoItem
                        changesData={detailsStore.changes.data}
                        chipsClassName={chipsClassName}
                        chipsData={chipsData}
                        currentField={header.id}
                        detailsInfoDispatch={detailsInfoDispatch}
                        detailsInfoState={detailsInfoState}
                        editableFieldType={detailsInfoState.editMode.fieldType}
                        formState={formState}
                        func={func}
                        handleDiscardChanges={handleDiscardChanges}
                        handleFinishEdit={handleFinishEdit}
                        info={info}
                        isFieldInEditMode={detailsInfoState.editMode.field === header.id}
                        item={detailsStore.infoContent[header.id]}
                        onClick={handleInfoItemClick}
                        params={params}
                        ref={ref}
                        setChangesData={setChangesData}
                        state={state}
                      />
                    </>
                  </li>
                )
              })}
            </ul>
          </div>
          {!isEveryObjectValueEmpty(additionalInfo) && (
            <div className={wrapperClassNames} data-testid="additional-info">
              {!isEveryObjectValueEmpty(additionalInfo.producer) && (
                <>
                  <h3 className="item-info__header">Producer</h3>
                  <ul className="item-info__details">{additionalInfo.producer}</ul>
                </>
              )}
              {!isEveryObjectValueEmpty(additionalInfo.drift) && (
                <>
                  <h3 className="item-info__header">Histogram Data Drift Application</h3>
                  <ul className="item-info__details">{additionalInfo.drift}</ul>
                </>
              )}
              {!isEveryObjectValueEmpty(additionalInfo.configuration) && (
                <>
                  <h3 className="item-info__header">Configuration</h3>
                  <ul className="item-info__details">{additionalInfo.configuration}</ul>
                </>
              )}
              {!isEveryObjectValueEmpty(additionalInfo.sources) && (
                <ArtifactInfoSources sources={additionalInfo.sources} />
              )}
            </div>
          )}
        </>
      )
    )
  }
)

DetailsInfoView.propTypes = {
  additionalInfo: PropTypes.shape({
    drift: PropTypes.array,
    producer: PropTypes.array,
    sources: PropTypes.shape({})
  }),
  detailsInfoDispatch: PropTypes.func.isRequired,
  detailsInfoState: PropTypes.shape({}).isRequired,
  detailsStore: PropTypes.shape({}).isRequired,
  formState: PropTypes.shape({}),
  handleFinishEdit: PropTypes.func.isRequired,
  handleInfoItemClick: PropTypes.func.isRequired,
  pageData: PropTypes.shape({}).isRequired,
  params: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default DetailsInfoView
