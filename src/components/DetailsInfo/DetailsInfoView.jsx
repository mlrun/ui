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
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'lodash'
import classnames from 'classnames'

import ArtifactInfoSources from '../ArtifactInfoSources/ArtifactInfoSources'
import DetailsInfoItem from '../../elements/DetailsInfoItem/DetailsInfoItem'
import { Tip } from 'igz-controls/components'

import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import {
  ALERTS_PAGE,
  ARTIFACTS_PAGE,
  DATASETS_PAGE,
  DOCUMENTS_PAGE,
  FEATURE_SETS_TAB,
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  LLM_PROMPTS_PAGE,
  MODELS_PAGE
} from '../../constants'
import { parseKeyValues } from '../../utils'
import { getChipOptions } from 'igz-controls/utils/chips.util'

import RightArrow from 'igz-controls/images/ic_arrow-right.svg?react'

import './detailsInfo.scss'

const DetailsInfoView = React.forwardRef(
  (
    {
      additionalInfo = {
        drift: [],
        producer: [],
        sources: {},
        alerts: []
      },
      detailsInfoDispatch,
      detailsInfoState,
      commonDetailsStore,
      formState,
      handleDiscardChanges,
      handleFinishEdit,
      handleInfoItemClick,
      isDetailsPopUp,
      pageData,
      params,
      selectedItem
    },
    ref
  ) => {
    const infoContent = useMemo(
      () => (isDetailsPopUp ? commonDetailsStore.detailsPopUpInfoContent : commonDetailsStore.infoContent),
      [commonDetailsStore.infoContent, commonDetailsStore.detailsPopUpInfoContent, isDetailsPopUp]
    )
    const wrapperClassNames = classnames(
      !isEveryObjectValueEmpty(additionalInfo)
        ? 'item-info__details-wrapper'
        : 'item-info__full-width'
    )

    return (
      !isEveryObjectValueEmpty(infoContent) && (
        <>
          <div className="item-info__details-wrapper">
            {(pageData.page === ALERTS_PAGE ||
              pageData.page === ARTIFACTS_PAGE ||
              pageData.page === DATASETS_PAGE ||
              pageData.page === FILES_PAGE ||
              pageData.page === FUNCTIONS_PAGE ||
              pageData.page === MODELS_PAGE ||
              pageData.page === FEATURE_STORE_PAGE ||
              pageData.page === DOCUMENTS_PAGE ||
              pageData.page === LLM_PROMPTS_PAGE) &&
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
                  if (infoContent[header.id]?.value === selectedItem.parametersChips) {
                    chipsData.chips = selectedItem.parametersChips
                    chipsData.chipOptions = getChipOptions('parameters')
                  } else if (infoContent[header.id]?.value === selectedItem.resultsChips) {
                    chipsData.chips = selectedItem.resultsChips
                    chipsData.chipOptions = getChipOptions('results')
                  } else if (infoContent[header.id]?.value === selectedItem.labels) {
                    chipsData.chips = selectedItem.labels
                    chipsData.chipOptions = getChipOptions('labels')
                  } else if (infoContent[header.id]?.value === selectedItem.nodeSelectorChips) {
                    chipsData.chips = selectedItem.nodeSelectorChips
                    chipsData.chipOptions = getChipOptions('results')
                  }

                  func =
                    infoContent[header.id]?.value === selectedItem.function
                      ? selectedItem.function
                      : ''
                  state =
                    infoContent[header.id]?.value === selectedItem.state?.value
                      ? selectedItem.state?.value
                      : ''
                  info = infoContent[header.id]?.value
                } else if (
                  pageData.page === ALERTS_PAGE ||
                  pageData.page === ARTIFACTS_PAGE ||
                  pageData.page === DATASETS_PAGE ||
                  pageData.page === FILES_PAGE ||
                  pageData.page === MODELS_PAGE ||
                  pageData.page === FEATURE_STORE_PAGE ||
                  pageData.page === DOCUMENTS_PAGE ||
                  pageData.page === LLM_PROMPTS_PAGE
                ) {
                  if (header.id === 'labels') {
                    chipsData.validationRules = infoContent[header.id]?.validationRules
                    chipsData.chips = formState.values.labels
                      ? parseKeyValues(formState.values.labels)
                      : parseKeyValues(infoContent[header.id]?.value)
                    chipsData.chipOptions = getChipOptions(header.id)
                  }
                  if (header.id === 'metrics') {
                    chipsData.chips = parseKeyValues(infoContent[header.id]?.value)
                    chipsData.chipOptions = getChipOptions(header.id)
                  } else if (header.id === 'relations') {
                    chipsData.chips = parseKeyValues(infoContent[header.id]?.value)
                    chipsData.chipOptions = getChipOptions(header.id)
                    chipsData.delimiter = <RightArrow />
                  }

                  info = !isNil(commonDetailsStore.changes.data[header.id])
                    ? commonDetailsStore.changes.data[header.id].currentFieldValue
                    : selectedItem && infoContent[header.id]?.value
                } else if (pageData.page === FUNCTIONS_PAGE) {
                  info =
                    header.id === 'kind'
                      ? infoContent[header.id]?.value || 'Local'
                      : infoContent[header.id]?.value || ''
                }

                return (
                  <li className={detailsItemClassNames} key={header.id}>
                    <>
                      <div className="details-item__header">
                        {header.label}:
                        {header.tip && <Tip className="details-item__tip" text={header.tip} />}
                      </div>
                      <DetailsInfoItem
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
                        isDetailsPopUp={isDetailsPopUp}
                        isFieldInEditMode={detailsInfoState.editMode.field === header.id}
                        item={infoContent[header.id]}
                        onClick={handleInfoItemClick}
                        params={params}
                        ref={ref}
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
              {!isEveryObjectValueEmpty(additionalInfo.document_loader) && (
                <>
                  <h3 className="item-info__header">Document loader</h3>
                  <ul className="item-info__details">{additionalInfo.document_loader}</ul>
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
                <ArtifactInfoSources
                  isDetailsPopUp={isDetailsPopUp}
                  sources={additionalInfo.sources}
                />
              )}
              {!isEveryObjectValueEmpty(additionalInfo?.alerts?.triggerCriteriaDetailsInfo) && (
                <>
                  <h3 className="item-info__header">Trigger criteria</h3>
                  <ul className="item-info__details">
                    {additionalInfo?.alerts?.triggerCriteriaDetailsInfo}
                  </ul>
                </>
              )}
              {!isEveryObjectValueEmpty(additionalInfo?.alerts?.triggerCriteriaDetailsInfo) && (
                <>
                  <h3 className="item-info__header">Notifications</h3>
                  <ul className="item-info__details alert-row__item-info-notification">
                    {additionalInfo?.alerts?.notificationsDetailsInfo}
                  </ul>
                </>
              )}
            </div>
          )}
        </>
      )
    )
  }
)

DetailsInfoView.displayName = 'DetailsInfoView'

DetailsInfoView.propTypes = {
  additionalInfo: PropTypes.shape({
    drift: PropTypes.array,
    producer: PropTypes.array,
    sources: PropTypes.object
  }),
  detailsInfoDispatch: PropTypes.func.isRequired,
  detailsInfoState: PropTypes.object.isRequired,
  commonDetailsStore: PropTypes.object.isRequired,
  formState: PropTypes.object,
  handleDiscardChanges: PropTypes.func.isRequired,
  handleFinishEdit: PropTypes.func.isRequired,
  handleInfoItemClick: PropTypes.func.isRequired,
  isDetailsPopUp: PropTypes.bool.isRequired,
  pageData: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  selectedItem: PropTypes.object.isRequired
}

export default DetailsInfoView
