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
import React, { useCallback, useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'

import ContentMenu from '../../elements/ContentMenu/ContentMenu'
import { ConfirmDialog } from 'igz-controls/components'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'

import { STATS_TOTAL_CARD, tabs } from './projectsJobsMotinoring.util'
import {
  JOBS_MONITORING_JOBS_TAB,
  JOBS_MONITORING_PAGE,
  JOBS_MONITORING_SCHEDULED_TAB,
  JOBS_MONITORING_WORKFLOWS_TAB
} from '../../constants'
import { actionCreator, monitorJob, rerunJob } from '../Jobs/jobs.util'
import { TERTIARY_BUTTON } from 'igz-controls/constants'
import projectsAction from '../../actions/projects'

import './projectsJobsMonitoring.scss'

export const ProjectJobsMonitoringContext = React.createContext({})

const ProjectsJobsMonitoring = ({ fetchJobFunction }) => {
  const [editableItem, setEditableItem] = useState(null)
  const [jobWizardMode, setJobWizardMode] = useState(null)
  const [jobWizardIsOpened, setJobWizardIsOpened] = useState(false)
  const [confirmData, setConfirmData] = useState(null)
  const [selectedTab, setSelectedTab] = useState('')
  const navigate = useNavigate()
  const { jobsMonitoringData } = useSelector(store => store.projectStore)
  const [selectedCard, setSelectedCard] = useState(
    jobsMonitoringData.filters?.status || STATS_TOTAL_CARD
  )
  //
  // TODO: add group by;
  //  add name filter;
  //  change time filter if the user changed the date filter in projects page
  const [filters] = useState({
    dates: {
      value: [new Date(moment().add(-1, 'days'))]
    }
  })
  const dispatch = useDispatch()
  const location = useLocation()
  const params = useParams()
  const appStore = useSelector(store => store.appStore)
  const artifactsStore = useSelector(store => store.artifactsStore)

  useEffect(() => {
    dispatch(projectsAction.removeJobsMonitoringFilters())
  }, [dispatch])

  const handleTabChange = tabName => {
    setSelectedCard(STATS_TOTAL_CARD)
    setSelectedTab(tabName)
    navigate(`/projects/jobs-monitoring/${tabName}`)
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
    setSelectedTab(
      location.pathname.includes(JOBS_MONITORING_WORKFLOWS_TAB)
        ? JOBS_MONITORING_WORKFLOWS_TAB
        : location.pathname.includes(JOBS_MONITORING_SCHEDULED_TAB)
          ? JOBS_MONITORING_SCHEDULED_TAB
          : JOBS_MONITORING_JOBS_TAB
    )
  }, [location.pathname])

  return (
    <>
      <div className="job-monitoring content-wrapper">
        <div className="content__header">
          <Breadcrumbs />
        </div>
        <div className="content">
          <div className="content__action-bar-wrapper">
            <ContentMenu
              activeTab={selectedTab}
              screen={JOBS_MONITORING_PAGE}
              onClick={handleTabChange}
              tabs={tabs}
            />
            <div className="action-bar">Filter menu</div>
          </div>
          <div className="table-container">
            <ProjectJobsMonitoringContext.Provider
              value={{
                filters,
                jobsMonitoringData,
                selectedCard,
                setSelectedCard,
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
            </ProjectJobsMonitoringContext.Provider>
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
})(ProjectsJobsMonitoring)
