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
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import Loader from '../../common/Loader/Loader'
import YamlModal from '../../common/YamlModal/YamlModal'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'

import { ModelsPageProvider, useModelsPage } from './ModelsPage.context'

import './modelsPage.scss'

const ModelsPage = () => {
  const artifactsStore = useSelector(store => store.artifactsStore)
  const { convertedYaml, toggleConvertedYaml } = useModelsPage()

  return (
    <>
      <div className="content-wrapper">
        <div className="content__header">
          <Breadcrumbs />
        </div>
        <div className="content">
          {artifactsStore.loading && <Loader />}
          <div className="table-container">
            <Outlet />
          </div>
        </div>
      </div>
      {convertedYaml.length > 0 && (
        <YamlModal convertedYaml={convertedYaml} toggleConvertToYaml={toggleConvertedYaml} />
      )}
      {artifactsStore?.preview?.isPreview && (
        <PreviewModal artifact={artifactsStore?.preview?.selectedItem} />
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
