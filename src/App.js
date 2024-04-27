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
import React, { Fragment, Suspense } from 'react'
import {
  Route,
  Navigate,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider
} from 'react-router-dom'
import classNames from 'classnames'

import Header from './layout/Header/Header'
import Loader from './common/Loader/Loader'

import { useNuclioMode } from './hooks/nuclioMode.hook'
import localStorageService from './utils/localStorageService'
import { lazyRetry } from './lazyWithRetry'

import {
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB,
  FEATURES_TAB,
  MODEL_ENDPOINTS_TAB,
  MODELS_TAB,
  MONITOR_JOBS_TAB,
  MONITOR_WORKFLOWS_TAB,
  PIPELINE_SUB_PAGE,
  PROJECTS_SETTINGS_GENERAL_TAB,
  PROJECT_MONITOR,
  PROJECT_QUICK_ACTIONS_PAGE,
  REAL_TIME_PIPELINES_TAB,
  SCHEDULE_TAB,
  JOBS_MONITORING_PAGE,
  JOBS_MONITORING_JOBS_TAB,
  JOBS_MONITORING_WORKFLOWS_TAB,
  JOBS_MONITORING_SCHEDULED_TAB
} from './constants'

import 'reactflow/dist/style.css'
import 'igz-controls/scss/common.scss'
import './scss/main.scss'

const Page = lazyRetry(() => import('./layout/Page/Page'))
const CreateJobPage = lazyRetry(() => import('./components/CreateJobPage/CreateJobPage'))
const Datasets = lazyRetry(() => import('./components/Datasets/Datasets'))
const FeatureStore = lazyRetry(() => import('./components/FeatureStore/FeatureStore'))
const Files = lazyRetry(() => import('./components/Files/Files'))
const Functions = lazyRetry(() => import('./components/FunctionsPage/Functions'))
const Jobs = lazyRetry(() => import('./components/Jobs/Jobs'))
const MonitorJobs = lazyRetry(() => import('./components/Jobs/MonitorJobs/MonitorJobs'))
const MonitorWorkflows = lazyRetry(() =>
  import('./components/Jobs/MonitorWorkflows/MonitorWorkflows')
)
const ScheduledJobs = lazyRetry(() => import('./components/Jobs/ScheduledJobs/ScheduledJobs'))
const Models = lazyRetry(() => import('./components/ModelsPage/Models/Models'))
const RealTimePipelines = lazyRetry(() =>
  import('./components/ModelsPage/RealTimePipelines/RealTimePipelines')
)
const ModelEndpoints = lazyRetry(() =>
  import('./components/ModelsPage/ModelEndpoints/ModelEndpoints')
)
const ModelsPage = lazyRetry(() => import('./components/ModelsPage/ModelsPage'))
const Projects = lazyRetry(() => import('./components/ProjectsPage/Projects'))
const ProjectMonitor = lazyRetry(() => import('./components/Project/ProjectMonitor'))
const ConsumerGroupsWrapper = lazyRetry(() =>
  import('./components/ConsumerGroupsWrapper/ConsumerGroupsWrapper')
)
const ConsumerGroup = lazyRetry(() => import('./components/ConsumerGroup/ConsumerGroup'))
const ConsumerGroups = lazyRetry(() => import('./components/ConsumerGroups/ConsumerGroups'))
const ProjectOverview = lazyRetry(() =>
  import('./components/Project/ProjectOverview/ProjectOverview')
)
const ProjectSettings = lazyRetry(() => import('./components/ProjectSettings/ProjectSettings'))
const AddToFeatureVectorPage = lazyRetry(() =>
  import('./components/AddToFeatureVectorPage/AddToFeatureVectorPage')
)
const FeatureSets = lazyRetry(() => import('./components/FeatureStore/FeatureSets/FeatureSets'))
const Features = lazyRetry(() => import('./components/FeatureStore/Features/Features'))
const FeatureVectors = lazyRetry(() =>
  import('./components/FeatureStore/FeatureVectors/FeatureVectors')
)
const ProjectsJobsMonitoring = lazyRetry(() =>
  import('./components/ProjectsJobsMonitoring/ProjectsJobsMonitoring')
)
const ProjectsJobsMonitoringWorkflows = lazyRetry(() =>
  import(
    './components/ProjectsJobsMonitoring/ProjectsJobsMonitoringWorkflows/ProjectsJobsMonitoringWorkflows'
  )
)
const JobsMonitoring = lazyRetry(() =>
  import('./components/ProjectsJobsMonitoring/JobsMonitoring/JobsMonitoring')
)
const ScheduledMonitoring = lazyRetry(() =>
  import('./components/ProjectsJobsMonitoring/ScheduledMonitoring/ScheduledMonitoring'))

const App = () => {
  const { isNuclioModeDisabled } = useNuclioMode()
  const isHeaderShown = localStorageService.getStorageValue('mlrunUi.headerHidden') !== 'true'
  const mlAppContainerClasses = classNames('ml-app-container', isHeaderShown && 'has-header')

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="" element={<Page isHeaderShown={isHeaderShown} />}>
          <Route path="projects" element={<Projects />} />
          <Route path={`projects/${JOBS_MONITORING_PAGE}/*`} element={<ProjectsJobsMonitoring />}>
            {[
              `${JOBS_MONITORING_JOBS_TAB}/:jobName/:jobProjectName/:jobId/:tab`,
              `${JOBS_MONITORING_JOBS_TAB}/:jobProjectName/:jobId/:tab`,
              `${JOBS_MONITORING_JOBS_TAB}/:jobName`,
              `${JOBS_MONITORING_JOBS_TAB}`
            ].map((path, index) => {
              return (
                <Fragment key={index}>
                  <Route path={path} element={<JobsMonitoring />} />
                </Fragment>
              )
            })}
            <Route
              path={JOBS_MONITORING_WORKFLOWS_TAB}
              element={<ProjectsJobsMonitoringWorkflows />}
            />
            <Route
              path={JOBS_MONITORING_SCHEDULED_TAB}
              element={<ScheduledMonitoring />}
            />
          </Route>
          <Route path="projects/:projectName" element={<Navigate replace to={PROJECT_MONITOR} />} />
          <Route path={`projects/:projectName/${PROJECT_MONITOR}`} element={<ProjectMonitor />} />

          {!isNuclioModeDisabled && (
            <Route
              path="projects/:projectName/monitor/consumer-groups/*"
              element={<ConsumerGroupsWrapper />}
            >
              <Route path="" exact element={<ConsumerGroups />} />
              <Route path=":functionName/:streamName" exact element={<ConsumerGroup />} />
            </Route>
          )}
          <Route
            path={`projects/:projectName/${PROJECT_QUICK_ACTIONS_PAGE}`}
            element={<ProjectOverview />}
          />
          <Route
            path="projects/:projectName/settings"
            element={<Navigate to={`${PROJECTS_SETTINGS_GENERAL_TAB}`} replace />}
          />
          <Route path="/projects/:projectName/settings/:pageTab" element={<ProjectSettings />} />
          {/*/!* Adding the next redirect for backwards compatability *!/*/}
          <Route
            path="projects/:projectName/jobs"
            element={<Navigate to={`${MONITOR_JOBS_TAB}`} replace />}
          />
          <Route
            path="projects/:projectName/jobs/:pageTab/create-new-job"
            element={<CreateJobPage />}
          />
          <Route path="projects/:projectName/jobs/*" element={<Jobs />}>
            {[
              `${MONITOR_JOBS_TAB}/:jobName/:jobId/:tab`,
              `${MONITOR_JOBS_TAB}/:jobId/:tab`,
              `${MONITOR_JOBS_TAB}/:jobName`,
              `${MONITOR_JOBS_TAB}`
            ].map((path, index) => {
              return (
                <Fragment key={index}>
                  <Route path={path} element={<MonitorJobs />} />
                </Fragment>
              )
            })}
            {[
              `${MONITOR_WORKFLOWS_TAB}/workflow/:workflowId/:functionName/:functionHash/:tab`,
              `${MONITOR_WORKFLOWS_TAB}/workflow/:workflowId/:jobId/:tab`,
              `${MONITOR_WORKFLOWS_TAB}/workflow/:workflowId`,
              `${MONITOR_WORKFLOWS_TAB}`
            ].map((path, index) => (
              <Fragment key={index}>
                <Route path={path} element={<MonitorWorkflows />} />
              </Fragment>
            ))}
            <Route path={`${SCHEDULE_TAB}`} element={<ScheduledJobs />} />
            <Route path="*" element={<Navigate to={MONITOR_JOBS_TAB} />} replace />
          </Route>
          {[
            'projects/:projectName/functions',
            'projects/:projectName/functions/:hash/:tab',
            'projects/:projectName/functions/:funcName/:tag/:tab'
          ].map((path, index) => (
            <Fragment key={index}>
              <Route path={path} element={<Functions />} />
            </Fragment>
          ))}
          <Route
            path="projects/:projectName/feature-store/datasets/*"
            element={<Navigate to=":name/:tag/:iter/:tab" replace />}
          />
          {[
            'projects/:projectName/datasets',
            'projects/:projectName/datasets/:name/:tag/:tab',
            'projects/:projectName/datasets/:name/:tag/:iter/:tab'
          ].map((path, index) => (
            <Fragment key={index}>
              <Route path={path} element={<Datasets />} />
            </Fragment>
          ))}
          <Route
            path="projects/:projectName/feature-store"
            element={<Navigate to={`${FEATURE_SETS_TAB}`} replace />}
          />
          <Route
            path="projects/:projectName/feature-store/add-to-feature-vector"
            element={<AddToFeatureVectorPage />}
          />
          <Route path="projects/:projectName/feature-store/*" element={<FeatureStore />}>
            {[`${FEATURE_SETS_TAB}`, `${FEATURE_SETS_TAB}/:name/:tag/:tab`].map((path, index) => (
              <Fragment key={index}>
                <Route path={path} element={<FeatureSets />} />
              </Fragment>
            ))}
            {[`${FEATURE_VECTORS_TAB}`, `${FEATURE_VECTORS_TAB}/:name/:tag/:tab`].map(
              (path, index) => (
                <Fragment key={index}>
                  <Route path={path} element={<FeatureVectors />} />
                </Fragment>
              )
            )}
            <Route path={`${FEATURES_TAB}`} element={<Features />} />
            <Route path="*" element={<Navigate to={FEATURE_SETS_TAB} replace />} />
          </Route>
          <Route path="projects/:projectName/models/*" element={<ModelsPage />}>
            {[
              `${MODELS_TAB}`,
              `${MODELS_TAB}/:name/:tab`,
              `${MODELS_TAB}/:name/:tag/:tab`,
              `${MODELS_TAB}/:name/:tag/:iter/:tab`
            ].map((path, index) => (
              <Fragment key={index}>
                <Route path={path} element={<Models />} />
              </Fragment>
            ))}
            {[`${MODEL_ENDPOINTS_TAB}`, `${MODEL_ENDPOINTS_TAB}/:name/:tag/:tab`].map(
              (path, index) => (
                <Fragment key={index}>
                  <Route path={path} element={<ModelEndpoints />} />
                </Fragment>
              )
            )}
            {[
              `${REAL_TIME_PIPELINES_TAB}`,
              `${REAL_TIME_PIPELINES_TAB}/${PIPELINE_SUB_PAGE}/:pipelineId`
            ].map((path, index) => (
              <Fragment key={index}>
                <Route path={path} element={<RealTimePipelines />} />
              </Fragment>
            ))}
            <Route path="*" element={<Navigate to={MODELS_TAB} replace />} />
          </Route>
          {[
            'projects/:projectName/files',
            'projects/:projectName/files/:name/:tag/:tab',
            'projects/:projectName/files/:name/:tag/:iter/:tab'
          ].map((path, index) => (
            <Fragment key={index}>
              <Route path={path} element={<Files />} />
            </Fragment>
          ))}
          <Route path="*" element={<Navigate replace to="projects" />} />
          <Route path="/" element={<Navigate replace to="projects" />} />
        </Route>
      </>
    ),
    { basename: process.env.PUBLIC_URL }
  )

  return (
    <div className="ml-app">
      {isHeaderShown && <Header />}
      <div className={mlAppContainerClasses}>
        <Suspense fallback={<Loader />}>
          <RouterProvider router={router} />
        </Suspense>
      </div>
    </div>
  )
}

export default App
