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
import React, { useCallback } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import PageActionsMenu from '../../common/PageActionsMenu/PageActionsMenu'
import {
  MODEL_ENDPOINTS_TAB,
  MODELS_PAGE,
  MODELS_TAB,
  REAL_TIME_PIPELINES_TAB
} from '../../constants'
import ContentMenu from '../../elements/ContentMenu/ContentMenu'
import Loader from '../../common/Loader/Loader'
import { tabs } from './modelsPage.util'
import RegisterModelModal from '../../elements/RegisterModelModal/RegisterModelModal'
import { ModelsPageProvider, useModelsPage } from './ModelsPage.context'
import { openPopUp } from 'igz-controls/utils/common.util'
import YamlModal from '../../common/YamlModal/YamlModal'
import { actionsMenuHeader } from './Models/models.util'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import { useMode } from '../../hooks/mode.hook'

import './modelsPage.scss'

const ModelsPage = () => {
  const location = useLocation()
  const artifactsStore = useSelector(store => store.artifactsStore)
  const params = useParams()
  const { isDemoMode } = useMode()
  const { convertedYaml, fetchData, toggleConvertedYaml } = useModelsPage()

  const handleRegisterModel = useCallback(() => {
    openPopUp(RegisterModelModal, { projectName: params.projectName, refresh: fetchData })
  }, [fetchData, params.projectName])
  return (
    <>
      <div className="content-wrapper">
        <div className="content__header">
          <Breadcrumbs />
          {/* TODO: remove from demo in 1.4 */}
          {isDemoMode && (
            <PageActionsMenu
              actionsMenuHeader={actionsMenuHeader}
              onClick={handleRegisterModel}
              showActionsMenu={params['*'].includes(MODELS_TAB)}
            />
          )}
        </div>
        <div className="content">
          <ContentMenu
            activeTab={
              location.pathname.includes(REAL_TIME_PIPELINES_TAB)
                ? REAL_TIME_PIPELINES_TAB
                : location.pathname.includes(MODEL_ENDPOINTS_TAB)
                ? MODEL_ENDPOINTS_TAB
                : MODELS_TAB
            }
            screen={MODELS_PAGE}
            tabs={tabs}
          />
          <div className="table-container">
            <Outlet />
            {artifactsStore.loading && <Loader />}
          </div>
        </div>
      </div>
      {convertedYaml.length > 0 && (
        <YamlModal convertedYaml={convertedYaml} toggleConvertToYaml={toggleConvertedYaml} />
      )}
      {artifactsStore?.preview?.isPreview && (
        <PreviewModal item={artifactsStore?.preview?.selectedItem} />
      )}
    </>
  )
}

const ModelsPageProviderComponent = () => (
  <ModelsPageProvider>
    <ModelsPage />
  </ModelsPageProvider>
)

export default ModelsPageProviderComponent
