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
import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import YamlModal from '../../common/YamlModal/YamlModal'
import FilterMenu from '../../components/FilterMenu/FilterMenu'
import Table from '../../components/Table/Table'
import ContentMenu from '../../elements/ContentMenu/ContentMenu'
import NoData from '../../common/NoData/NoData'
import PageActionsMenu from '../../common/PageActionsMenu/PageActionsMenu'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import TableTop from '../../elements/TableTop/TableTop'

import { generateContentActionsMenu } from './content.util'
import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { isProjectValid } from '../../utils/handleRedirect'
import { useYaml } from '../../hooks/yaml.hook'
import {
  ADD_TO_FEATURE_VECTOR_TAB,
  FEATURE_STORE_PAGE,
  GROUP_BY_NONE,
  MODELS_PAGE
} from '../../constants'
import { useGroupContent } from '../../hooks/groupContent.hook'

import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'

const Content = ({
  applyDetailsChanges,
  artifactsStore,
  cancelRequest = () => {},
  children,
  content,
  filtersChangeCallback = null,
  filtersStore,
  getIdentifier,
  handleActionsMenuClick = () => {},
  handleCancel = () => {},
  handleRemoveRequestData,
  handleSelectItem = () => {},
  header,
  loading,
  pageData,
  projectStore,
  refresh,
  selectedItem = {},
  tableTop = null
}) => {
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const [showActionsMenu, setShowActionsMenu] = useState(false)
  const navigate = useNavigate()
  const params = useParams()
  const location = useLocation()
  const { groupedContent, expand, handleExpandRow, handleExpandAll } = useGroupContent(
    content,
    getIdentifier,
    handleRemoveRequestData,
    pageData.handleRequestOnExpand,
    null,
    pageData.page,
    params.pageTab
  )

  const contentClassName = classnames('content')
  const filterMenuClassNames = classnames(
    'content__action-bar-wrapper',
    pageData.hideFilterMenu && 'content__action-bar-wrapper_hidden'
  )

  const actionsMenu = useMemo(() => {
    return generateContentActionsMenu(pageData.actionsMenu, [
      {
        label: 'View YAML',
        icon: <Yaml />,
        onClick: toggleConvertedYaml
      }
    ])
  }, [pageData.actionsMenu, toggleConvertedYaml])

  useEffect(() => {
    if (!pageData.hidePageActionMenu) {
      setShowActionsMenu(true)
    } else if (showActionsMenu) {
      setShowActionsMenu(false)
    }
  }, [pageData.hidePageActionMenu, showActionsMenu])

  useEffect(() => {
    isProjectValid(navigate, projectStore.projectsNames.data, params.projectName)
  }, [navigate, params.projectName, projectStore.projectsNames.data])

  return (
    <>
      <div className="content__header">
        {header ? header : <Breadcrumbs />}
        <PageActionsMenu
          actionsMenuHeader={pageData.actionsMenuHeader}
          onClick={handleActionsMenuClick}
          showActionsMenu={showActionsMenu}
        />
      </div>
      <div className={contentClassName}>
        {[FEATURE_STORE_PAGE, MODELS_PAGE].includes(pageData.page) &&
          !location.pathname.includes(ADD_TO_FEATURE_VECTOR_TAB) && (
            <ContentMenu activeTab={params.pageTab} screen={pageData.page} tabs={pageData.tabs} />
          )}

        <div className="table-container">
          {tableTop && (
            <TableTop link={tableTop.link} text={tableTop.text}>
              {tableTop.children}
            </TableTop>
          )}
          <div className={filterMenuClassNames}>
            <FilterMenu
              actionButton={pageData.filterMenuActionButton}
              cancelRequest={cancelRequest}
              expand={expand}
              filters={pageData.filters}
              handleExpandAll={handleExpandAll}
              onChange={filtersChangeCallback ?? refresh}
              page={pageData.page}
              withoutExpandButton={
                Boolean(pageData.handleRequestOnExpand) || pageData.withoutExpandButton
              }
            />
          </div>
          {children ? (
            children
          ) : loading ? null : (filtersStore.groupBy !== GROUP_BY_NONE &&
              isEmpty(groupedContent)) ||
            content.length === 0 ? (
            <NoData
              message={getNoDataMessage(
                filtersStore,
                pageData.filters,
                null,
                pageData.page,
                params.pageTab
              )}
            />
          ) : (
            <>
              <Table
                actionsMenu={actionsMenu}
                applyDetailsChanges={applyDetailsChanges}
                content={content}
                groupedContent={groupedContent}
                handleCancel={handleCancel}
                handleExpandRow={handleExpandRow}
                handleSelectItem={handleSelectItem}
                pageData={pageData}
                retryRequest={refresh}
                selectedItem={selectedItem}
              />
            </>
          )}
        </div>
        {convertedYaml.length > 0 && (
          <YamlModal convertedYaml={convertedYaml} toggleConvertToYaml={toggleConvertedYaml} />
        )}
      </div>
      {artifactsStore?.preview?.isPreview && (
        <PreviewModal artifact={artifactsStore?.preview?.selectedItem} />
      )}
    </>
  )
}

Content.propTypes = {
  cancelRequest: PropTypes.func,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  filtersChangeCallback: PropTypes.func,
  getIdentifier: PropTypes.func.isRequired,
  handleActionsMenuClick: PropTypes.func,
  handleCancel: PropTypes.func,
  handleSelectItem: PropTypes.func,
  loading: PropTypes.bool.isRequired,
  pageData: PropTypes.shape({}).isRequired,
  refresh: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}),
  tableTop: PropTypes.shape({
    link: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  })
}

export default connect(
  ({ artifactsStore, filtersStore, projectStore }) => ({
    artifactsStore,
    filtersStore,
    projectStore
  }),
  null
)(Content)
