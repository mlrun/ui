import React, { useEffect, useState, useCallback } from 'react'
import { connect, useSelector } from 'react-redux'
import { useNavigate, useParams, Outlet, useLocation } from 'react-router-dom'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import ContentMenu from '../../elements/ContentMenu/ContentMenu'
import JobWizard from '../JobWizard/JobWizard'
import Loader from '../../common/Loader/Loader'
import PageActionsMenu from '../../common/PageActionsMenu/PageActionsMenu'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import { ConfirmDialog } from 'igz-controls/components'

import { JOBS_PAGE, MONITOR_JOBS_TAB, MONITOR_WORKFLOWS_TAB, SCHEDULE_TAB } from '../../constants'
import { TERTIARY_BUTTON } from 'igz-controls/constants'
import { actionCreator, actionsMenuHeader, monitorJob, rerunJob, tabs } from './jobs.util'
import { isPageTabValid, isProjectValid } from '../../utils/handleRedirect'
import { openPopUp } from 'igz-controls/utils/common.util'

export const JobsContext = React.createContext({})

const Jobs = ({ fetchJobFunction, setNotification }) => {
  const [confirmData, setConfirmData] = useState(null)
  const [editableItem, setEditableItem] = useState(null)
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const functionsStore = useSelector(store => store.functionsStore)
  const projectStore = useSelector(store => store.projectStore)
  const jobsStore = useSelector(store => store.jobsStore)
  const workflowsStore = useSelector(store => store.workflowsStore)
  const appStore = useSelector(store => store.appStore)
  const artifactsStore = useSelector(store => store.artifactsStore)

  const handleActionsMenuClick = () => {
    openPopUp(JobWizard, { params })
  }

  const handleRerunJob = useCallback(
    async job => await rerunJob(job, fetchJobFunction, setNotification, setEditableItem),
    [fetchJobFunction, setNotification]
  )

  const handleMonitoring = useCallback(
    item => {
      monitorJob(appStore.frontendSpec.jobs_dashboard_url, item, params.projectName)
    },
    [appStore.frontendSpec.jobs_dashboard_url, params.projectName]
  )

  useEffect(() => {
    if (location.pathname.match('\\b\\monitor(?!-)\\b')) {
      /*/!* Adding the next redirect for backwards compatability *!/*/
      navigate(location.pathname.replace('monitor', MONITOR_JOBS_TAB), { replace: true })
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

  useEffect(() => {
    isProjectValid(navigate, projectStore.projectsNames.data, params.projectName)
  }, [navigate, params.projectName, projectStore.projectsNames.data])

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
        <div className="content content_with-menu">
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
          <div className="table-container">
            <JobsContext.Provider
              value={{
                editableItem,
                handleMonitoring,
                handleRerunJob,
                setConfirmData,
                setEditableItem
              }}
            >
              <Outlet />
            </JobsContext.Provider>
            {(jobsStore.loading ||
              workflowsStore.workflows.loading ||
              workflowsStore.activeWorkflow.loading ||
              functionsStore.loading) && <Loader />}
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
        <PreviewModal item={artifactsStore?.preview?.selectedItem} />
      )}
    </>
  )
}

export default connect(null, {
  ...actionCreator
})(React.memo(Jobs))
