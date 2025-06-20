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
import { createPortal } from 'react-dom'
import {
  Route,
  Navigate,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider
} from 'react-router-dom'
import classNames from 'classnames'
import 'prismjs'
import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-yaml.min.js'
import 'prismjs/components/prism-json.min.js'
import 'prismjs/components/prism-python.min.js'

import { LoaderForSuspenseFallback } from 'igz-controls/components'
import Header from './layout/Header/Header'
import Notifications from './common/Notifications/Notifications'

import localStorageService from './utils/localStorageService'
import { lazyRetry } from './lazyWithRetry'
import { useMode } from './hooks/mode.hook'
import { useNuclioMode } from './hooks/nuclioMode.hook'

import {
  ALERTS_PAGE_PATH,
  ALL_VERSIONS_PATH,
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB,
  FEATURES_TAB,
  MODEL_ENDPOINTS_TAB,
  MODELS_TAB,
  MONITOR_ALERTS_PAGE,
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
  JOBS_MONITORING_SCHEDULED_TAB,
  INACTIVE_JOBS_TAB
} from './constants'

import 'reactflow/dist/style.css'
import 'igz-controls/index.css'
import './scss/main.scss'

const Page = lazyRetry(() => import('./layout/Page/Page'))
const Datasets = lazyRetry(() => import('./components/Datasets/Datasets'))
const FeatureStore = lazyRetry(() => import('./components/FeatureStore/FeatureStore'))
const Files = lazyRetry(() => import('./components/Files/Files'))
const FunctionsOld = lazyRetry(() => import('./components/FunctionsPageOld/FunctionsOld')) // todo [functionsWithPagination] delete FunctionsOld and other related logic in 1.9.0
const Functions = lazyRetry(() => import('./components/FunctionsPage/Functions'))
const Jobs = lazyRetry(() => import('./components/Jobs/Jobs'))
const MonitorJobs = lazyRetry(() => import('./components/Jobs/MonitorJobs/MonitorJobs'))
const MonitorWorkflows = lazyRetry(
  () => import('./components/Jobs/MonitorWorkflows/MonitorWorkflows')
)
const ScheduledJobs = lazyRetry(() => import('./components/Jobs/ScheduledJobs/ScheduledJobs'))
const Models = lazyRetry(() => import('./components/ModelsPage/Models/Models'))
const RealTimePipelines = lazyRetry(
  () => import('./components/ModelsPage/RealTimePipelines/RealTimePipelines')
)
const ModelEndpoints = lazyRetry(
  () => import('./components/ModelsPage/ModelEndpoints/ModelEndpoints')
)
const ModelsPage = lazyRetry(() => import('./components/ModelsPage/ModelsPage'))
const Projects = lazyRetry(() => import('./components/ProjectsPage/Projects'))
const ProjectMonitor = lazyRetry(() => import('./components/Project/ProjectMonitor'))
const ConsumerGroupsWrapper = lazyRetry(
  () => import('./components/ConsumerGroupsWrapper/ConsumerGroupsWrapper')
)
const ConsumerGroup = lazyRetry(() => import('./components/ConsumerGroup/ConsumerGroup'))
const ConsumerGroups = lazyRetry(() => import('./components/ConsumerGroups/ConsumerGroups'))
const ProjectOverview = lazyRetry(
  () => import('./components/Project/ProjectOverview/ProjectOverview')
)
const ProjectSettings = lazyRetry(() => import('./components/ProjectSettings/ProjectSettings'))
const AddToFeatureVectorPage = lazyRetry(
  () => import('./components/AddToFeatureVectorPage/AddToFeatureVectorPage')
)
const FeatureSets = lazyRetry(() => import('./components/FeatureStore/FeatureSets/FeatureSets'))
const Features = lazyRetry(() => import('./components/FeatureStore/Features/Features'))
const FeatureVectors = lazyRetry(
  () => import('./components/FeatureStore/FeatureVectors/FeatureVectors')
)
const ProjectsJobsMonitoring = lazyRetry(
  () => import('./components/ProjectsJobsMonitoring/ProjectsJobsMonitoring')
)
const ProjectsAlerts = lazyRetry(() => import('./components/Alerts/Alerts'))
const JobsMonitoring = lazyRetry(
  () => import('./components/ProjectsJobsMonitoring/JobsMonitoring/JobsMonitoring')
)
const ScheduledMonitoring = lazyRetry(
  () => import('./components/ProjectsJobsMonitoring/ScheduledMonitoring/ScheduledMonitoring')
)
const WorkflowsMonitoring = lazyRetry(
  () => import('./components/ProjectsJobsMonitoring/WorkflowsMonitoring/WorkflowsMonitoring')
)
const Documents = lazyRetry(() => import('./components/Documents/Documents'))
const LLMPrompts = lazyRetry(() => import('./components/LLMPrompts/LLMPrompts'))
const ApplicationMetrics = lazyRetry(
  () => import('./components/ApplicationMetrics/ApplicationMetrics')
)

const MonitoringApplicationsPage = lazyRetry(
  () => import('./components/MonitoringApplicationsPage/MonitoringApplicationsPage')
)
const MonitoringApplications = lazyRetry(
  () =>
    import('./components/MonitoringApplicationsPage/MonitoringApplications/MonitoringApplications')
)
const MonitoringApplication = lazyRetry(
  () =>
    import(
      './components/MonitoringApplicationsPage/MonitoringApplications/MonitoringApplication/MonitoringApplication'
    )
)

const App = () => {
  const { isNuclioModeDisabled } = useNuclioMode()
  const { isDemoMode } = useMode()
  const isHeaderShown = localStorageService.getStorageValue('mlrunUi.headerHidden') !== 'true'
  const mlAppContainerClasses = classNames('ml-app-container', isHeaderShown && 'has-header')

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="" element={<Page isHeaderShown={isHeaderShown} />}>
          <Route path="projects" element={<Projects />} />
          <Route path={`projects/*/${JOBS_MONITORING_PAGE}/*`} element={<ProjectsJobsMonitoring />}>
            {[
              `${JOBS_MONITORING_JOBS_TAB}/:jobName/:jobId/:tab`,
              `${JOBS_MONITORING_JOBS_TAB}/:jobId/:tab`,
              `${JOBS_MONITORING_JOBS_TAB}/:jobName`,
              `${JOBS_MONITORING_JOBS_TAB}`
            ].map((path, index) => {
              return (
                <Fragment key={index}>
                  <Route path={path} element={<JobsMonitoring />} />
                </Fragment>
              )
            })}
            {[
              `${JOBS_MONITORING_WORKFLOWS_TAB}/workflow/:workflowProjectName/:workflowId/:functionName/:functionHash/:tab`,
              `${JOBS_MONITORING_WORKFLOWS_TAB}/workflow/:workflowProjectName/:workflowId/:jobId/:tab`,
              `${JOBS_MONITORING_WORKFLOWS_TAB}/workflow/:workflowProjectName/:workflowId`,
              `${JOBS_MONITORING_WORKFLOWS_TAB}`
            ].map((path, index) => (
              <Fragment key={index}>
                <Route path={path} element={<WorkflowsMonitoring />} />
              </Fragment>
            ))}
            <Route path={JOBS_MONITORING_SCHEDULED_TAB} element={<ScheduledMonitoring />} />
            <Route path="*" element={<Navigate to={JOBS_MONITORING_JOBS_TAB} replace />} />
          </Route>
          <Route path="projects/:projectName" element={<Navigate replace to={PROJECT_MONITOR} />} />
          <Route path={`projects/:projectName/${PROJECT_MONITOR}`} element={<ProjectMonitor />} />

          {[
            `projects/:id/${MONITOR_ALERTS_PAGE}`,
            `projects/:id/${MONITOR_ALERTS_PAGE}/:project/:alertName/:alertId/:entityName/:uid/:tab`,
            `projects/:projectName/${ALERTS_PAGE_PATH}`,
            `projects/:projectName/${ALERTS_PAGE_PATH}/:project/:alertName/:alertId/:entityName/:uid/:tab`
          ].map((path, index) => (
            <Fragment key={index}>
              <Route path={path} element={<ProjectsAlerts />} />
            </Fragment>
          ))}

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
          <Route path="projects/:projectName/jobs/*" element={<Jobs />}>
            {[
              `${MONITOR_JOBS_TAB}/:jobName/:jobId/:tab`,
              `${MONITOR_JOBS_TAB}/:jobId/:tab`,
              /*/!* Adding for backwards compatibility, it redirects from INACTIVE_JOBS_TAB in Jobs.jxs to MONITOR_JOBS_TAB *!/*/
              `${INACTIVE_JOBS_TAB}/:jobId/:tab`,
              /*/!***********************************************************************************************************!/*/
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
          {isDemoMode
            ? [
                'projects/:projectName/functions',
                'projects/:projectName/functions/:funcName/:id/:tab',
                `projects/:projectName/functions/:funcName/${ALL_VERSIONS_PATH}`,
                `projects/:projectName/functions/:funcName/${ALL_VERSIONS_PATH}/:id/:tab`
              ].map((path, index) => (
                <Fragment key={index}>
                  <Route
                    path={path}
                    element={<Functions isAllVersions={[2, 3].includes(index)} />}
                  />
                </Fragment>
              ))
            : [
                'projects/:projectName/functions',
                'projects/:projectName/functions/:hash/:tab',
                'projects/:projectName/functions/:funcName/:tag/:tab'
              ].map((path, index) => (
                <Fragment key={index}>
                  <Route path={path} element={<FunctionsOld />} />
                </Fragment>
              ))}
          {[
            'projects/:projectName/datasets',
            'projects/:projectName/datasets/:artifactName/:id/:tab',
            `projects/:projectName/datasets/:artifactName/${ALL_VERSIONS_PATH}`,
            `projects/:projectName/datasets/:artifactName/${ALL_VERSIONS_PATH}/:id/:tab`
          ].map((path, index) => (
            <Fragment key={index}>
              <Route path={path} element={<Datasets isAllVersions={[2, 3].includes(index)} />} />
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
              `${MODELS_TAB}/:artifactName/:id/:tab`,
              `${MODELS_TAB}/:artifactName/${ALL_VERSIONS_PATH}`,
              `${MODELS_TAB}/:artifactName/${ALL_VERSIONS_PATH}/:id/:tab`
            ].map((path, index) => (
              <Fragment key={index}>
                <Route path={path} element={<Models isAllVersions={[2, 3].includes(index)} />} />
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
            'projects/:projectName/files/:artifactName/:id/:tab',
            `projects/:projectName/files/:artifactName/${ALL_VERSIONS_PATH}`,
            `projects/:projectName/files/:artifactName/${ALL_VERSIONS_PATH}/:id/:tab`
          ].map((path, index) => (
            <Fragment key={index}>
              <Route path={path} element={<Files isAllVersions={[2, 3].includes(index)} />} />
            </Fragment>
          ))}
          {[
            `projects/:projectName/monitoring-app/:appName/${MODEL_ENDPOINTS_TAB}`,
            `projects/:projectName/monitoring-app/:appName/${MODEL_ENDPOINTS_TAB}/:id`
          ].map((path, index) => (
            <Fragment key={index}>
              <Route path={path} element={<ApplicationMetrics />} />
            </Fragment>
          ))}
          <Route
            path="projects/:projectName/monitoring-app/*"
            element={<MonitoringApplicationsPage />}
          >
            <Route path="" element={<MonitoringApplications />} />
            {[':name'].map((path, index) => (
              <Fragment key={index}>
                <Route path={path} element={<MonitoringApplication />} />
              </Fragment>
            ))}
          </Route>
          {[
            'projects/:projectName/documents',
            'projects/:projectName/documents/:artifactName/:id/:tab',
            `projects/:projectName/documents/:artifactName/${ALL_VERSIONS_PATH}`,
            `projects/:projectName/documents/:artifactName/${ALL_VERSIONS_PATH}/:id/:tab`
          ].map((path, index) => (
            <Fragment key={index}>
              <Route path={path} element={<Documents isAllVersions={[2, 3].includes(index)} />} />
            </Fragment>
          ))}
          {[
            'projects/:projectName/llm-prompts',
            'projects/:projectName/llm-prompts/:artifactName/:id/:tab',
            `projects/:projectName/llm-prompts/:artifactName/${ALL_VERSIONS_PATH}`,
            `projects/:projectName/llm-prompts/:artifactName/${ALL_VERSIONS_PATH}/:id/:tab`
          ].map((path, index) => (
            <Fragment key={index}>
              <Route path={path} element={<LLMPrompts isAllVersions={[2, 3].includes(index)} />} />
            </Fragment>
          ))}
          <Route path="*" element={<Navigate replace to="projects" />} />
          <Route path="/" element={<Navigate replace to="projects" />} />
        </Route>
      </>
    ),
    { basename: import.meta.env.VITE_PUBLIC_URL }
  )

  return (
    <div className="ml-app">
      {isHeaderShown && <Header />}
      <div className={mlAppContainerClasses}>
        <Suspense fallback={<LoaderForSuspenseFallback />}>
          <RouterProvider router={router} />
        </Suspense>
        {createPortal(<Notifications />, document.getElementById('overlay_container'))}
      </div>
    </div>
  )
}

export default App
