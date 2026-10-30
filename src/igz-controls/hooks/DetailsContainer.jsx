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
import { Form } from 'react-final-form'

import BlockerSpy from '../components/BlockerSpy/BlockerSpy'
import ErrorMessage from '../components/ErrorMessage/ErrorMessage'
import Loader from '../components/Loader/Loader'
import TabsSlider from '../components/TabsSlider/TabsSlider'
import ConfirmDialog from '../components/ConfirmDialog/ConfirmDialog'

import { PRIMARY_BUTTON, TERTIARY_BUTTON } from '../constants'
import { DETAILS_MENU } from '../types'

const DetailsContainer = ({
  blocker,
  commonDetailsStore,
  detailsMenu,
  detailsPanelClassNames,
  detailsPopUpSelectedTab = '',
  detailsRef,
  detailsStore,
  doNotLeavePage,
  formRef,
  isDetailsPopUp = null,
  leavePage,
  params,
  renderHeader,
  renderTabsContent,
  setBlocker,
  setDetailsPopUpSelectedTab = null,
  shouldDetailsBlock,
  withActionMenu = true
}) => {
  return (
    <Form form={formRef} onSubmit={() => {}}>
      {formState => (
        <div className={detailsPanelClassNames} ref={detailsRef} data-testid="detailsPanel">
          {detailsStore.loadingCounter > 0 && <Loader />}
          {detailsStore.error && <ErrorMessage message={detailsStore.error.message} />}
          <div className="item-header-wrapper">
            {renderHeader()}
            {withActionMenu && (
              <TabsSlider
                initialTab={isDetailsPopUp ? detailsPopUpSelectedTab : params.tab}
                isDetailsPopUp={isDetailsPopUp}
                onClick={newTab => setDetailsPopUpSelectedTab && setDetailsPopUpSelectedTab(newTab)}
                skipLink={isDetailsPopUp}
                tabsList={detailsMenu}
              />
            )}
          </div>
          <div className="item-info">{renderTabsContent(formState)}</div>
          {(blocker.state === 'blocked' || commonDetailsStore.showWarning) && (
            <ConfirmDialog
              cancelButton={{
                handler: doNotLeavePage,
                label: 'Cancel',
                variant: TERTIARY_BUTTON
              }}
              closePopUp={doNotLeavePage}
              confirmButton={{
                handler: leavePage,
                label: 'Yes',
                variant: PRIMARY_BUTTON
              }}
              header="You have unsaved changes."
              isOpen={blocker.state === 'blocked' || commonDetailsStore.showWarning}
              message="Do you want to discard the changes?"
            />
          )}
          {!isDetailsPopUp && (
            <BlockerSpy setBlocker={setBlocker} shouldBlock={shouldDetailsBlock} />
          )}
        </div>
      )}
    </Form>
  )
}

DetailsContainer.propTypes = {
  blocker: PropTypes.object.isRequired,
  detailsMenu: DETAILS_MENU.isRequired,
  detailsPanelClassNames: PropTypes.string.isRequired,
  detailsPopUpSelectedTab: PropTypes.string,
  detailsRef: PropTypes.object.isRequired,
  detailsStore: PropTypes.object.isRequired,
  commonDetailsStore: PropTypes.object.isRequired,
  doNotLeavePage: PropTypes.func.isRequired,
  formRef: PropTypes.object.isRequired,
  isDetailsPopUp: PropTypes.bool,
  leavePage: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  renderHeader: PropTypes.func.isRequired,
  renderTabsContent: PropTypes.func.isRequired,
  setBlocker: PropTypes.func.isRequired,
  setDetailsPopUpSelectedTab: PropTypes.func,
  shouldDetailsBlock: PropTypes.func.isRequired,
  withActionMenu: PropTypes.bool
}

export default DetailsContainer
