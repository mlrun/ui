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
import classnames from 'classnames'

import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'
import Loader from '../../common/Loader/Loader'
import TabsSlider from '../../common/TabsSlider/TabsSlider'
import { ConfirmDialog } from 'igz-controls/components'
import { TERTIARY_BUTTON, PRIMARY_BUTTON } from 'igz-controls/constants'
import { ACTIONS_MENU } from '../../types'

import DetailsHeader from './DetailsHeader/DetailsHeader'

const DetailsView = React.forwardRef(
  (
    {
      actionsMenu,
      applyChanges,
      applyChangesRef,
      cancelChanges,
      children,
      getCloseDetailsLink,
      detailsMenu,
      detailsMenuClick,
      detailsStore,
      handleCancel,
      handleRefresh,
      handleShowWarning,
      isDetailsScreen,
      leavePage,
      pageData,
      params,
      selectedItem,
      setIteration,
      setFiltersWasHandled,
      tabsContent,
      tab
    },
    ref
  ) => {
    const detailsPanelClassNames = classnames(
      'table__item',
      detailsStore.showWarning && 'pop-up-dialog-opened',
      isDetailsScreen && 'table__item_big'
    )

    return (
      <div className={detailsPanelClassNames} ref={ref}>
        {detailsStore.loading && <Loader />}
        {detailsStore.error && <ErrorMessage message={detailsStore.error.message} />}
        <DetailsHeader
          actionsMenu={actionsMenu}
          applyChanges={applyChanges}
          applyChangesRef={applyChangesRef}
          cancelChanges={cancelChanges}
          getCloseDetailsLink={getCloseDetailsLink}
          handleCancel={handleCancel}
          handleRefresh={handleRefresh}
          handleShowWarning={handleShowWarning}
          isDetailsScreen={isDetailsScreen}
          pageData={pageData}
          selectedItem={selectedItem}
          setIteration={setIteration}
          tab={tab}
        />
        <TabsSlider tabsList={detailsMenu} onClick={detailsMenuClick} initialTab={params.tab} />
        {children}
        {detailsStore.showWarning && (
          <ConfirmDialog
            cancelButton={{
              handler: () => {
                handleShowWarning(false)
                setFiltersWasHandled(false)
              },
              label: detailsStore.filtersWasHandled ? "Don't refresh" : "Don't Leave",
              variant: TERTIARY_BUTTON
            }}
            closePopUp={() => {
              handleShowWarning(false)
              setFiltersWasHandled(false)
            }}
            confirmButton={{
              handler: leavePage,
              label: detailsStore.filtersWasHandled ? 'Refresh' : 'Leave',
              variant: PRIMARY_BUTTON
            }}
            header="You have unsaved changes."
            isOpen={detailsStore.showWarning}
            message={`${
              detailsStore.filtersWasHandled ? 'Refreshing the list' : 'Leaving this page'
            } will discard your changes.`}
          />
        )}
      </div>
    )
  }
)

DetailsView.defaultProps = {
  detailsMenuClick: () => {},
  getCloseDetailsLink: null,
  handleRefresh: () => {},
  tabsContent: null,
  tab: ''
}

DetailsView.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  applyChanges: PropTypes.func.isRequired,
  cancelChanges: PropTypes.func.isRequired,
  detailsMenu: PropTypes.array.isRequired,
  detailsMenuClick: PropTypes.func,
  detailsStore: PropTypes.shape({}).isRequired,
  getCloseDetailsLink: PropTypes.func,
  handleCancel: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func,
  handleShowWarning: PropTypes.func.isRequired,
  isDetailsScreen: PropTypes.bool.isRequired,
  leavePage: PropTypes.func.isRequired,
  pageData: PropTypes.shape({}).isRequired,
  params: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setIteration: PropTypes.func.isRequired,
  setFiltersWasHandled: PropTypes.func.isRequired,
  tabsContent: PropTypes.element,
  tab: PropTypes.string
}

export default DetailsView
