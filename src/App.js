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
import React, { Fragment, Suspense, useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'

import Header from './layout/Header/Header'
import Loader from './common/Loader/Loader'
import Navbar from './layout/Navbar/Navbar'

import { useMode } from './hooks/mode.hook'
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
  REAL_TIME_PIPELINES_TAB,
  SCHEDULE_TAB
} from './constants'

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

const App = () => {
  const [projectName, setProjectName] = useState('')
  const [isNavbarPinned, setIsNavbarPinned] = useState(
    localStorageService.getStorageValue('mlrunUi.navbarStatic', true)
  )

  const { isDemoMode } = useMode()
  const { isNuclioModeDisabled } = useNuclioMode()

  const isHeaderShown = window.localStorage.getItem('mlrunUi.headerHidden') !== 'true'

  return (
    <div className="ml-app">
      {isHeaderShown && <Header />}
      {projectName && (
        <Navbar
          isHeaderShown={isHeaderShown}
          isNavbarPinned={isNavbarPinned}
          projectName={projectName}
          setIsNavbarPinned={setIsNavbarPinned}
        />
      )}
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path=""
            element={
              <Page
                isHeaderShown={isHeaderShown}
                isNavbarPinned={isNavbarPinned}
                setProjectName={setProjectName}
              />
            }
          >
            <Route path="projects" element={<Projects />} />

            <Route path="projects/:projectName/monitor" element={<ProjectMonitor />} />
            <Route
              path="projects/:projectName"
              element={!isDemoMode ? <Navigate to="monitor" replace /> : <ProjectOverview />}
            />
            {!isNuclioModeDisabled && (
              <Route
                path="projects/:projectName/monitor/consumer-groups/*"
                element={<ConsumerGroupsWrapper />}
              >
                <Route path="" exact element={<ConsumerGroups />} />
                <Route path=":consumerGroupName" exact element={<ConsumerGroup />} />
              </Route>
            )}
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
            <Route path="projects/:projectName/functions" element={<Functions />} />
            <Route path="projects/:projectName/functions/:hash/:tab" element={<Functions />} />
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
              <Route path="*" element={<Navigate to={FEATURE_SETS_TAB} />} replace />
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
              <Route path="*" element={<Navigate to={MODELS_TAB} />} replace />
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
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
