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
import React, { useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import DetailsHeader from './DetailsHeader/DetailsHeader'
import DetailsTabsContent from './DetailsTabsContent/DetailsTabsContent'

import {
  ALERTS_PAGE,
  ARTIFACTS_PAGE,
  DATASETS_PAGE,
  DETAILS_OVERVIEW_TAB,
  DOCUMENTS_PAGE,
  EMPTY_OBJECT,
  FILES_PAGE,
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  LLM_PROMPTS_PAGE,
  MODEL_ENDPOINTS_TAB,
  MODELS_TAB
} from '../../constants'
import {
  generateAlertsContent,
  generateArtifactsContent,
  generateFeatureStoreContent,
  generateFunctionsContent,
  generateJobsContent
} from './details.util'
import { DETAILS_MENU, ACTIONS_MENU } from 'igz-controls/types'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { removeModelFeatureVector } from '../../reducers/detailsReducer'
import { showArtifactsPreview } from '../../reducers/artifactsReducer'
import { useDetails } from 'igz-controls/hooks/useDetails.hook'

import 'igz-controls/scss/details.scss'

const Details = ({
  actionsMenu,
  applyDetailsChanges = () => {},
  applyDetailsChangesCallback = () => {},
  detailsMenu,
  detailsPopUpSelectedTab = DETAILS_OVERVIEW_TAB,
  formInitialValues = EMPTY_OBJECT,
  getCloseDetailsLink = null,
  handleCancel = null,
  handleRefresh = () => {},
  isDetailsPopUp = false,
  isDetailsScreen = false,
  pageData,
  selectedItem,
  setDetailsPopUpSelectedTab = null,
  tab = '',
  withActionMenu = true
}) => {
  const {
    DetailsContainer,
    applyChanges,
    applyChangesRef,
    blocker,
    cancelChanges,
    detailsPanelClassNames,
    detailsRef,
    commonDetailsStore,
    doNotLeavePage,
    form,
    handleShowWarning,
    leavePage,
    location,
    params,
    removeDetailsInfo,
    setBlocker,
    setDetailsInfo,
    shouldDetailsBlock
  } = useDetails({
    applyDetailsChanges,
    applyDetailsChangesCallback,
    formInitialValues,
    isDetailsPopUp,
    isDetailsScreen,
    selectedItem
  })
  const detailsStore = useSelector(store => store.detailsStore)
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const dispatch = useDispatch()

  const handlePreview = useCallback(() => {
    dispatch(
      showArtifactsPreview({
        isPreview: true,
        selectedItem
      })
    )
  }, [dispatch, selectedItem])

  useEffect(() => {
    if (!isEveryObjectValueEmpty(selectedItem)) {
      if (pageData.details.type === JOBS_PAGE) {
        dispatch(setDetailsInfo(generateJobsContent(selectedItem)))
      } else if (pageData.details.type === ALERTS_PAGE) {
        dispatch(setDetailsInfo(generateAlertsContent(selectedItem)))
      } else if (
        pageData.details.type === ARTIFACTS_PAGE ||
        pageData.details.type === FILES_PAGE ||
        pageData.details.type === MODELS_TAB ||
        pageData.details.type === MODEL_ENDPOINTS_TAB ||
        pageData.details.type === DATASETS_PAGE ||
        pageData.details.type === DOCUMENTS_PAGE ||
        pageData.details.type === LLM_PROMPTS_PAGE
      ) {
        dispatch(
          setDetailsInfo(
            generateArtifactsContent(
              pageData.details.type,
              selectedItem,
              params.projectName,
              isDetailsPopUp,
              frontendSpec.internal_labels
            )
          )
        )
      } else if (pageData.details.type === FUNCTIONS_PAGE) {
        dispatch(setDetailsInfo(generateFunctionsContent(selectedItem)))
      } else {
        dispatch(
          setDetailsInfo(
            generateFeatureStoreContent(pageData.details.type, selectedItem, isDetailsPopUp)
          )
        )
      }
    }
  }, [
    frontendSpec.internal_labels,
    isDetailsPopUp,
    location.search,
    pageData.details.type,
    params.projectName,
    setDetailsInfo,
    selectedItem,
    dispatch
  ])

  useEffect(() => {
    return () => {
      if (pageData.details.type === MODELS_TAB) {
        dispatch(removeModelFeatureVector())
      }

      dispatch(removeDetailsInfo())
    }
  }, [dispatch, pageData.details.type, removeDetailsInfo, selectedItem])

  return (
    <DetailsContainer
      blocker={blocker}
      detailsMenu={detailsMenu}
      detailsPanelClassNames={detailsPanelClassNames}
      setDetailsPopUpSelectedTab={setDetailsPopUpSelectedTab}
      detailsPopUpSelectedTab={detailsPopUpSelectedTab}
      params={params}
      detailsRef={detailsRef}
      detailsStore={detailsStore}
      commonDetailsStore={commonDetailsStore}
      doNotLeavePage={doNotLeavePage}
      form={form}
      isDetailsPopUp={isDetailsPopUp}
      leavePage={leavePage}
      renderHeader={() => (
        <DetailsHeader
          actionsMenu={actionsMenu}
          applyChanges={applyChanges}
          applyChangesRef={applyChangesRef}
          cancelChanges={cancelChanges}
          getCloseDetailsLink={getCloseDetailsLink}
          isDetailsPopUp={isDetailsPopUp}
          isDetailsScreen={isDetailsScreen}
          handleCancel={handleCancel}
          handleRefresh={handleRefresh}
          handleShowWarning={handleShowWarning}
          pageData={pageData}
          selectedItem={selectedItem}
          tab={tab}
          withActionMenu={withActionMenu}
        />
      )}
      renderTabsContent={formState => (
        <DetailsTabsContent
          applyChangesRef={applyChangesRef}
          detailsPopUpSelectedTab={detailsPopUpSelectedTab}
          formState={formState}
          handlePreview={handlePreview}
          isDetailsPopUp={isDetailsPopUp}
          pageData={pageData}
          selectedItem={selectedItem}
        />
      )}
      setBlocker={setBlocker}
      shouldDetailsBlock={shouldDetailsBlock}
      withActionMenu={withActionMenu}
    />
  )
}

Details.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  applyDetailsChanges: PropTypes.func,
  applyDetailsChangesCallback: PropTypes.func,
  detailsMenu: DETAILS_MENU.isRequired,
  detailsPopUpSelectedTab: PropTypes.string,
  formInitialValues: PropTypes.object,
  getCloseDetailsLink: PropTypes.func,
  handleCancel: PropTypes.func,
  handleRefresh: PropTypes.func,
  isDetailsPopUp: PropTypes.bool,
  isDetailsScreen: PropTypes.bool,
  pageData: PropTypes.object.isRequired,
  selectedItem: PropTypes.object.isRequired,
  setDetailsPopUpSelectedTab: PropTypes.func,
  tab: PropTypes.string,
  withActionMenu: PropTypes.bool
}

export default Details
