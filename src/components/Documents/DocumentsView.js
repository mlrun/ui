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
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import Loader from '../../common/Loader/Loader'
import PageHeader from '../../elements/PageHeader/PageHeader'
import ActionBar from '../ActionBar/ActionBar'
import ArtifactsFilters from '../ArtifactsActionBar/ArtifactsFilters'

import { DOCUMENTS_PAGE } from '../../constants'
import { filtersConfig } from './documents.util'

const DocumentsView = ({ filters, setSearchParams }) => {
  const artifactsStore = useSelector(store => store.artifactsStore)

  return (
    <>
      <div className="content-wrapper">
        <div className="content__header">
          <Breadcrumbs />
        </div>
        <div className="content">
          <PageHeader
            title="Documents"
            description="Short explanation about what documents are and what they can do for you and for your project."
          />
          {artifactsStore.loading && <Loader />}
          <div className="table-container">
            <div className="content__action-bar-wrapper">
              <ActionBar
                filters={filters}
                filtersConfig={filtersConfig}
                handleRefresh={() => {}}
                page={DOCUMENTS_PAGE}
                setSearchParams={setSearchParams}
                withRefreshButton
                withoutExpandButton
              >
                <ArtifactsFilters artifacts={[]} />
              </ActionBar>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

DocumentsView.propTypes = {
  filters: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired
}

export default DocumentsView
