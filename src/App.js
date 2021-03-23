import React, { Suspense } from 'react'
import {
  Redirect,
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import Page from './layout/Page/Page'
import Loader from './common/Loader/Loader'

import './scss/main.scss'

const CreateJobPage = React.lazy(() =>
  import('./components/CreateJobPage/CreateJobPage')
)
const FeatureStore = React.lazy(() =>
  import('./components/FeatureStore/FeatureStore')
)
const Files = React.lazy(() => import('./components/Files/Files'))
const Functions = React.lazy(() =>
  import('./components/FunctionsPage/Functions')
)
const Jobs = React.lazy(() => import('./components/JobsPage/Jobs'))
const Models = React.lazy(() => import('./components/Models/Models'))
const Project = React.lazy(() => import('./components/Project/Project'))
const Projects = React.lazy(() => import('./components/ProjectsPage/Projects'))

const App = () => {
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
            <Route
              path="/projects/:projectName"
              exact
              render={routeProps => <Project {...routeProps} />}
            />
            <Route
              path="/projects/:projectName/jobs/:pageTab/:jobId/:tab"
              exact
              render={routeProps => <Jobs {...routeProps} />}
            />
            <Redirect
              exact
              from="/projects/:projectName/jobs"
              to="/projects/:projectName/jobs/monitor"
            />
            <Route
              path="/projects/:projectName/jobs/:pageTab"
              exact
              strict
              render={routeProps => <Jobs {...routeProps} />}
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
            <Route
              path="/projects/:projectName/jobs/:pageTab/create-new-job"
              exact
              strict
              render={routeProps => <CreateJobPage {...routeProps} />}
            />
            <Redirect
              exact
              from="/projects/:projectName/feature-store"
              to="/projects/:projectName/feature-store/feature-sets"
            />
            <Route
              exact
              path="/projects/:projectName/feature-store/:pageTab"
              render={routeProps => <FeatureStore {...routeProps} />}
            />
            <Route
              exact
              path="/projects/:projectName/feature-store/:pageTab/:name/:tab"
              render={routeProps => <FeatureStore {...routeProps} />}
            />
            <Route
              exact
              path="/projects/:projectName/feature-store/:pageTab/:name/:tag/:tab"
              render={routeProps => <FeatureStore {...routeProps} />}
            />
            <Redirect
              exact
              from="/projects/:projectName/models"
              to="/projects/:projectName/models/models"
            />
            <Route
              exact
              path="/projects/:projectName/models/:pageTab"
              render={routeProps => <Models {...routeProps} />}
            />
            <Route
              exact
              path="/projects/:projectName/models/:pageTab/:name/:tab"
              render={routeProps => <Models {...routeProps} />}
            />
            <Route
              exact
              path="/projects/:projectName/models/:pageTab/:name/:tag/:tab"
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
            <Redirect to="/projects" />
          </Switch>
        </Suspense>
      </Page>
    </Router>
  )
}

export default App
