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
import React, { useEffect, useState, useCallback } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Outlet, useLocation } from 'react-router-dom'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import ContentMenu from '../../elements/ContentMenu/ContentMenu'
import Loader from '../../common/Loader/Loader'
import PageActionsMenu from '../../common/PageActionsMenu/PageActionsMenu'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import { ConfirmDialog } from 'igz-controls/components'

import {
  INACTIVE_JOBS_TAB,
  JOBS_PAGE,
  MONITOR_JOBS_TAB,
  MONITOR_WORKFLOWS_TAB,
  PANEL_CREATE_MODE,
  PROJECTS_PAGE_PATH,
  SCHEDULE_TAB
} from '../../constants'
import { TERTIARY_BUTTON } from 'igz-controls/constants'
import { actionCreator, actionsMenuHeader, monitorJob, rerunJob, tabs } from './jobs.util'
import { isPageTabValid } from '../../utils/handleRedirect'

export const JobsContext = React.createContext({})

const Jobs = ({ fetchJobFunction }) => {
  const [confirmData, setConfirmData] = useState(null)
  const [editableItem, setEditableItem] = useState(null)
  const [jobWizardMode, setJobWizardMode] = useState(null)
  const [jobWizardIsOpened, setJobWizardIsOpened] = useState(false)
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const functionsStore = useSelector(store => store.functionsStore)
  const jobsStore = useSelector(store => store.jobsStore)
  const workflowsStore = useSelector(store => store.workflowsStore)
  const appStore = useSelector(store => store.appStore)
  const artifactsStore = useSelector(store => store.artifactsStore)

  const handleActionsMenuClick = () => {
    setJobWizardMode(PANEL_CREATE_MODE)
  }

  const handleRerunJob = useCallback(
    async job => await rerunJob(job, fetchJobFunction, setEditableItem, setJobWizardMode, dispatch),
    [fetchJobFunction, dispatch]
  )

  const handleMonitoring = useCallback(
    item => {
      monitorJob(appStore.frontendSpec.jobs_dashboard_url, item, params.projectName)
    },
    [appStore.frontendSpec.jobs_dashboard_url, params.projectName]
  )

  useEffect(() => {
    const urlPathArray = location.pathname.split('/')
    const monitorJobsIndex = urlPathArray.indexOf(PROJECTS_PAGE_PATH) + 3

    if (urlPathArray[monitorJobsIndex] === INACTIVE_JOBS_TAB) {
      /*/!* Adding the next redirect for backwards compatability *!/*/
      urlPathArray[monitorJobsIndex] = MONITOR_JOBS_TAB
      navigate(urlPathArray.join('/'), { replace: true })
    } else {
      const pageTab = location.pathname.includes(MONITOR_WORKFLOWS_TAB)
        ? MONITOR_WORKFLOWS_TAB
        : location.pathname.includes(SCHEDULE_TAB)
          ? SCHEDULE_TAB
          : MONITOR_JOBS_TAB

      isPageTabValid(
        pageTab,
        tabs.map(tab => tab.id),
        navigate,
        location
      )
    }
  }, [navigate, params.pageTab, location])

  return (
    <>
      <div className="content-wrapper">
        <div className="content__header">
          <Breadcrumbs />
          <PageActionsMenu
            actionsMenuHeader={actionsMenuHeader}
            onClick={handleActionsMenuClick}
            showActionsMenu={true}
          />
        </div>
        <div className="content">
          <div className="content__action-bar-wrapper">
            <ContentMenu
              activeTab={
                location.pathname.includes(MONITOR_JOBS_TAB)
                  ? MONITOR_JOBS_TAB
                  : location.pathname.includes(SCHEDULE_TAB)
                    ? SCHEDULE_TAB
                    : MONITOR_WORKFLOWS_TAB
              }
              screen={JOBS_PAGE}
              tabs={tabs}
            />
          </div>

          <div className="table-container">
            <JobsContext.Provider
              value={{
                editableItem,
                handleMonitoring,
                handleRerunJob,
                jobWizardIsOpened,
                jobWizardMode,
                setConfirmData,
                setEditableItem,
                setJobWizardIsOpened,
                setJobWizardMode
              }}
            >
              <Outlet />
            </JobsContext.Provider>
            {(jobsStore.loading ||
              workflowsStore.workflows.loading ||
              workflowsStore.activeWorkflow.loading ||
              functionsStore.loading ||
              functionsStore.funcLoading) && <Loader />}
          </div>
        </div>
      </div>
      {confirmData && (
        <ConfirmDialog
          cancelButton={{
            handler: confirmData.rejectHandler,
            label: 'Cancel',
            variant: TERTIARY_BUTTON
          }}
          closePopUp={confirmData.rejectHandler}
          confirmButton={{
            handler: () => confirmData.confirmHandler(confirmData.item),
            label: confirmData.btnConfirmLabel,
            variant: confirmData.btnConfirmType
          }}
          header={confirmData.header}
          isOpen={confirmData}
          message={confirmData.message}
        />
      )}
      {artifactsStore?.preview?.isPreview && (
        <PreviewModal artifact={artifactsStore?.preview?.selectedItem} />
      )}
    </>
  )
}

export default connect(null, {
  ...actionCreator
})(React.memo(Jobs))
