import React, { Suspense } from 'react'
import {
  Redirect,
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import Page from './layout/Page/Page'
import Loader from './common/Loader/Loader'

import { useMode } from './hooks/mode.hook'
import { useNuclioMode } from './hooks/nuclioMode.hook'
import {
  FEATURE_SETS_TAB,
  MODELS_TAB,
  MONITOR_JOBS_TAB,
  PIPELINE_SUB_PAGE,
  PROJECTS_SETTINGS_GENERAL_TAB,
  WORKFLOW_SUB_PAGE
} from './constants'

import './scss/main.scss'

const CreateJobPage = React.lazy(() =>
  import('./components/CreateJobPage/CreateJobPage')
)
const Datasets = React.lazy(() => import('./components/Datasets/Datasets'))
const FeatureStore = React.lazy(() =>
  import('./components/FeatureStore/FeatureStore')
)
const Files = React.lazy(() => import('./components/Files/Files'))
const Functions = React.lazy(() =>
  import('./components/FunctionsPage/Functions')
)
const Jobs = React.lazy(() => import('./components/Jobs/Jobs'))
const Models = React.lazy(() => import('./components/Models/Models'))
const Projects = React.lazy(() => import('./components/ProjectsPage/Projects'))
const ProjectMonitor = React.lazy(() =>
  import('./components/Project/ProjectMonitor')
)
const ConsumerGroupsWrapper = React.lazy(() =>
  import('./components/ConsumerGroupsWrapper/ConsumerGroupsWrapper')
)
const ProjectOverview = React.lazy(() =>
  import('./components/Project/ProjectOverview/ProjectOverview')
)
const ProjectSettings = React.lazy(() =>
  import('./components/ProjectSettings/ProjectSettings')
)
const AddToFeatureVectorPage = React.lazy(() =>
  import('./components/AddToFeatureVectorPage/AddToFeatureVectorPage')
)

const App = () => {
  const { isDemoMode } = useMode()
  const { isNuclioModeDisabled } = useNuclioMode()

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Page>
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route
              path="/projects"
              exact
              render={routeProps => <Projects {...routeProps} />}
            />
            {!isDemoMode && (
              <Redirect
                exact
                from="/projects/:projectName"
                to="/projects/:projectName/monitor"
              />
            )}
            <Route
              path="/projects/:projectName"
              exact
              render={routeProps => <ProjectOverview {...routeProps} />}
            />
            <Route
              path="/projects/:projectName/monitor"
              exact
              render={routeProps => <ProjectMonitor {...routeProps} />}
            />
            {!isNuclioModeDisabled && (
              <Route
                path="/projects/:projectName/monitor/consumer-groups"
                render={routeProps => <ConsumerGroupsWrapper {...routeProps} />}
              />
            )}
            <Route
              exact
              path="/projects/:projectName/settings/:pageTab"
              render={routeProps => <ProjectSettings {...routeProps} />}
            />
            <Redirect
              exact
              from="/projects/:projectName/settings"
              to={`/projects/:projectName/settings/${PROJECTS_SETTINGS_GENERAL_TAB}`}
            />
            {/* Adding the next redirect for backwards compatability */}
            <Redirect
              from="/projects/:projectName/jobs/monitor/*"
              to={'/projects/:projectName/jobs/monitor-jobs/*'}
            />
            <Route
              path="/projects/:projectName/jobs/:pageTab/create-new-job"
              render={routeProps => <CreateJobPage {...routeProps} />}
            />
            <Route
              path={[
                `/projects/:projectName/jobs/:pageTab/${WORKFLOW_SUB_PAGE}/:workflowId/:functionName/:functionHash/:tab`,
                `/projects/:projectName/jobs/:pageTab/${WORKFLOW_SUB_PAGE}/:workflowId/:jobId/:tab`,
                `/projects/:projectName/jobs/:pageTab/${WORKFLOW_SUB_PAGE}/:workflowId`
              ]}
              exact
              render={routeProps => (
                <Jobs {...routeProps} subPage={WORKFLOW_SUB_PAGE} />
              )}
            />
            <Route
              path={[
                '/projects/:projectName/jobs/:pageTab/:jobName/:jobId/:tab',
                '/projects/:projectName/jobs/:pageTab/:jobId/:tab',
                '/projects/:projectName/jobs/:pageTab/:jobName',
                '/projects/:projectName/jobs/:pageTab'
              ]}
              exact
              render={routeProps => <Jobs {...routeProps} />}
            />
            <Redirect
              exact
              from="/projects/:projectName/jobs"
              to={`/projects/:projectName/jobs/${MONITOR_JOBS_TAB}`}
            />
            <Route
              exact
              path="/projects/:projectName/functions"
              render={routeProps => <Functions {...routeProps} />}
            />
            <Route
              exact
              path="/projects/:projectName/functions/:hash/:tab"
              render={routeProps => <Functions {...routeProps} />}
            />
            <Redirect
              exact
              path={[
                '/projects/:projectName/feature-store/datasets',
                '/projects/:projectName/feature-store/datasets/:name/:tab',
                '/projects/:projectName/feature-store/datasets/:name/:tag/:tab',
                '/projects/:projectName/feature-store/datasets/:name/:tag/:iter/:tab'
              ]}
              to="/projects/:projectName/datasets/:name/:tag/:iter/:tab"
            />
            <Route
              exact
              path={[
                '/projects/:projectName/datasets',
                '/projects/:projectName/datasets/:name/:tag/:tab',
                '/projects/:projectName/datasets/:name/:tag/:iter/:tab'
              ]}
              render={routeProps => <Datasets {...routeProps} />}
            />

            <Route
              exact
              path="/projects/:projectName/feature-store/add-to-feature-vector"
              render={routeProps => <AddToFeatureVectorPage {...routeProps} />}
            />

            <Redirect
              exact
              from="/projects/:projectName/feature-store"
              to={`/projects/:projectName/feature-store/${FEATURE_SETS_TAB}`}
            />
            <Route
              exact
              path={[
                '/projects/:projectName/feature-store/:pageTab',
                '/projects/:projectName/feature-store/:pageTab/:name/:tab',
                '/projects/:projectName/feature-store/:pageTab/:name/:tag/:tab',
                '/projects/:projectName/feature-store/:pageTab/:name/:tag/:iter/:tab'
              ]}
              render={routeProps => <FeatureStore {...routeProps} />}
            />
            <Redirect
              exact
              from="/projects/:projectName/models"
              to={`/projects/:projectName/models/${MODELS_TAB}`}
            />
            <Route
              exact
              path={[
                `/projects/:projectName/models/:pageTab/${PIPELINE_SUB_PAGE}/:pipelineId`
              ]}
              render={routeProps => (
                <Models {...routeProps} subPage={PIPELINE_SUB_PAGE} />
              )}
            />
            <Route
              exact
              path={[
                '/projects/:projectName/models/:pageTab',
                '/projects/:projectName/models/:pageTab/:name/:tab',
                '/projects/:projectName/models/:pageTab/:name/:tag/:tab'
              ]}
              render={routeProps => <Models {...routeProps} />}
            />
            <Route
              exact
              path="/projects/:projectName/models/:pageTab/:name/:tag/:iter/:tab"
              render={routeProps => <Models {...routeProps} />}
            />
            <Route
              exact
              path="/projects/:projectName/files"
              render={routeProps => <Files {...routeProps} />}
            />
            <Route
              exact
              path="/projects/:projectName/files/:name/:tag/:tab"
              render={routeProps => <Files {...routeProps} />}
            />
            <Route
              exact
              path="/projects/:projectName/files/:name/:tag/:iter/:tab"
              render={routeProps => <Files {...routeProps} />}
            />
            <Redirect to="/projects" />
          </Switch>
        </Suspense>
      </Page>
    </Router>
  )
}

export default App
