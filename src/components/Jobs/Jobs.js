import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useNavigate, useParams, Outlet, useLocation } from 'react-router-dom'
import classnames from 'classnames'

import ContentMenu from '../../elements/ContentMenu/ContentMenu'
import ConfirmDialog from '../../common/ConfirmDialog/ConfirmDialog'
import Loader from '../../common/Loader/Loader'
import PageActionsMenu from '../../common/PageActionsMenu/PageActionsMenu'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'

import { actionsMenuHeader, tabs } from './jobs.util'
import {
  JOBS_PAGE,
  MONITOR_JOBS_TAB,
  MONITOR_WORKFLOWS_TAB,
  SCHEDULE_TAB
} from '../../constants'
import { TERTIARY_BUTTON } from 'igz-controls/constants'
import { isPageTabValid, isProjectValid } from '../../utils/handleRedirect'

export const JobsContext = React.createContext({})

const Jobs = ({ functionsStore, jobsStore, projectStore, workflowsStore }) => {
  const [confirmData, setConfirmData] = useState(null)
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const contentClassName = classnames('content', 'content_with-menu')

  const handleActionsMenuClick = () => {
    const tab = location.pathname.includes(MONITOR_JOBS_TAB)
      ? MONITOR_JOBS_TAB
      : location.pathname.includes(SCHEDULE_TAB)
      ? SCHEDULE_TAB
      : MONITOR_WORKFLOWS_TAB

    navigate(`/projects/${params.projectName}/jobs/${tab}/create-new-job`)
  }

  useEffect(() => {
    const pageTab = location.pathname.includes(MONITOR_JOBS_TAB)
      ? MONITOR_JOBS_TAB
      : location.pathname.includes(SCHEDULE_TAB)
      ? SCHEDULE_TAB
      : MONITOR_WORKFLOWS_TAB

    isPageTabValid(
      pageTab,
      tabs.map(tab => tab.id),
      navigate,
      location
    )
  }, [navigate, params.pageTab, location])

  useEffect(() => {
    isProjectValid(navigate, projectStore.projectsNames.data, params.projectName)
  }, [navigate, params.projectName, projectStore.projectsNames.data])

  return (
    <>
      <div className="content-wrapper">
        <div className="content__header">
          <Breadcrumbs />
          <PageActionsMenu actionsMenuHeader={actionsMenuHeader} onClick={handleActionsMenuClick} />
        </div>
        <div className={contentClassName}>
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
            <JobsContext.Provider value={{ setConfirmData }}>
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
          message={confirmData.message}
        />
      )}
    </>
  )
}

export default connect(
  ({ functionsStore, jobsStore, projectStore, workflowsStore }) => ({
    functionsStore,
    jobsStore,
    projectStore,
    workflowsStore
  }),
  null
)(React.memo(Jobs))
