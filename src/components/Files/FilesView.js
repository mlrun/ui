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
import { useParams } from 'react-router-dom'

import FilterMenu from '../FilterMenu/FilterMenu'
import NoData from '../../common/NoData/NoData'
import Table from '../Table/Table'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import RegisterArtifactModal from '../RegisterArtifactModal/RegisterArtifactModal'
import YamlModal from '../../common/YamlModal/YamlModal'
import Loader from '../../common/Loader/Loader'
import PageActionsMenu from '../../common/PageActionsMenu/PageActionsMenu'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import ArtifactsTableRow from '../../elements/ArtifactsTableRow/ArtifactsTableRow'

import { ARTIFACT_TYPE, FILES_PAGE } from '../../constants'
import { getNoDataMessage } from '../../layout/Content/content.util'
import { actionsMenuHeader, filters } from './files.util'
import { openPopUp } from 'igz-controls/utils/common.util'

const FilesView = React.forwardRef(
  (
    {
      actionsMenu,
      applyDetailsChanges,
      applyDetailsChangesCallback,
      artifactsStore,
      convertedYaml,
      files,
      filtersStore,
      handleExpandRow,
      handleRefresh,
      pageData,
      selectedFile,
      selectedRowData,
      setSelectedFile,
      tableContent,
      toggleConvertedYaml
    },
    ref
  ) => {
    const params = useParams()

    return (
      <>
        <div className="content-wrapper" ref={ref}>
          <div className="content__header">
            <Breadcrumbs />
            <PageActionsMenu
              actionsMenuHeader={actionsMenuHeader}
              onClick={() =>
                openPopUp(RegisterArtifactModal, {
                  artifactKind: ARTIFACT_TYPE,
                  projectName: params.projectName,
                  refresh: handleRefresh,
                  title: actionsMenuHeader
                })
              }
              showActionsMenu
            />
          </div>
          <div className="content">
            {artifactsStore.loading && <Loader />}
            <div className="table-container">
              <div className="content__action-bar">
                <FilterMenu
                  filters={filters}
                  onChange={handleRefresh}
                  page={FILES_PAGE}
                  withoutExpandButton
                />
              </div>
              {artifactsStore.loading ? null : files.length === 0 ? (
                <NoData message={getNoDataMessage(filtersStore, filters, FILES_PAGE)} />
              ) : (
                <>
                  <Table
                    actionsMenu={actionsMenu}
                    applyDetailsChanges={applyDetailsChanges}
                    applyDetailsChangesCallback={applyDetailsChangesCallback}
                    content={files}
                    handleCancel={() => setSelectedFile({})}
                    pageData={pageData}
                    retryRequest={handleRefresh}
                    selectedItem={selectedFile}
                    tableHeaders={tableContent[0]?.content ?? []}
                  >
                    {tableContent.map((tableItem, index) => (
                      <ArtifactsTableRow
                        actionsMenu={actionsMenu}
                        handleExpandRow={handleExpandRow}
                        handleSelectItem={setSelectedFile}
                        key={index}
                        rowItem={tableItem}
                        selectedItem={selectedFile}
                        selectedRowData={selectedRowData}
                      />
                    ))}
                  </Table>
                </>
              )}
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
)

FilesView.propTypes = {
  actionsMenu: PropTypes.arrayOf(PropTypes.object).isRequired,
  applyDetailsChanges: PropTypes.func.isRequired,
  applyDetailsChangesCallback: PropTypes.func.isRequired,
  artifactsStore: PropTypes.object.isRequired,
  convertedYaml: PropTypes.string.isRequired,
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  filtersStore: PropTypes.object.isRequired,
  handleExpandRow: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  pageData: PropTypes.object.isRequired,
  selectedFile: PropTypes.object.isRequired,
  selectedRowData: PropTypes.object.isRequired,
  setSelectedFile: PropTypes.func.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleConvertedYaml: PropTypes.func.isRequired
}

export default FilesView
