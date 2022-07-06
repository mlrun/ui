import React, { Fragment, Suspense, useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'

import Header from './layout/Header/Header'
import Loader from './common/Loader/Loader'
import Navbar from './layout/Navbar/Navbar'

import { useMode } from './hooks/mode.hook'
import { useNuclioMode } from './hooks/nuclioMode.hook'
import localStorageService from './utils/localStorageService'

import {
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB,
  FEATURES_TAB,
  MODELS_TAB,
  MONITOR_JOBS_TAB,
  MONITOR_WORKFLOWS_TAB,
  PIPELINE_SUB_PAGE,
  PROJECTS_SETTINGS_GENERAL_TAB,
  SCHEDULE_TAB
} from './constants'

import 'igz-controls/scss/common.scss'
import './scss/main.scss'

const Page = React.lazy(() => import('./layout/Page/Page'))
const CreateJobPage = React.lazy(() => import('./components/CreateJobPage/CreateJobPage'))
const Datasets = React.lazy(() => import('./components/Datasets/Datasets'))
const FeatureStore = React.lazy(() => import('./components/FeatureStore/FeatureStore'))
const Files = React.lazy(() => import('./components/Files/Files'))
const Functions = React.lazy(() => import('./components/FunctionsPage/Functions'))
const Jobs = React.lazy(() => import('./components/Jobs/Jobs'))
const MonitorJobs = React.lazy(() => import('./components/Jobs/MonitorJobs/MonitorJobs'))
const MonitorWorkflows = React.lazy(() =>
  import('./components/Jobs/MonitorWorkflows/MonitorWorkflows')
)
const ScheduledJobs = React.lazy(() => import('./components/Jobs/ScheduledJobs/ScheduledJobs'))
const Models = React.lazy(() => import('./components/Models/Models'))
const Projects = React.lazy(() => import('./components/ProjectsPage/Projects'))
const ProjectMonitor = React.lazy(() => import('./components/Project/ProjectMonitor'))
const ConsumerGroupsWrapper = React.lazy(() =>
  import('./components/ConsumerGroupsWrapper/ConsumerGroupsWrapper')
)
const ConsumerGroup = React.lazy(() => import('./components/ConsumerGroup/ConsumerGroup'))
const ConsumerGroups = React.lazy(() => import('./components/ConsumerGroups/ConsumerGroups'))
const ProjectOverview = React.lazy(() =>
  import('./components/Project/ProjectOverview/ProjectOverview')
)
const ProjectSettings = React.lazy(() => import('./components/ProjectSettings/ProjectSettings'))
const AddToFeatureVectorPage = React.lazy(() =>
  import('./components/AddToFeatureVectorPage/AddToFeatureVectorPage')
)
const FeatureSets = React.lazy(() => import('./components/FeatureStore/FeatureSets/FeatureSets'))
const Features = React.lazy(() => import('./components/FeatureStore/Features/Features'))
const FeatureVectors = React.lazy(() =>
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
            <Route
              path="projects/:projectName/models"
              element={<Navigate to={`${MODELS_TAB}`} replace />}
            />
            <Route
              path={`projects/:projectName/models/:pageTab/${PIPELINE_SUB_PAGE}/:pipelineId`}
              element={<Models subPage={PIPELINE_SUB_PAGE} />}
            />
            {[
              'projects/:projectName/models/:pageTab',
              'projects/:projectName/models/:pageTab/:name/:tab',
              'projects/:projectName/models/:pageTab/:name/:tag/:tab',
              'projects/:projectName/models/:pageTab/:name/:tag/:iter/:tab'
            ].map((path, index) => (
              <Fragment key={index}>
                <Route path={path} element={<Models />} />
              </Fragment>
            ))}
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
