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

const Projects = React.lazy(() => import('./components/ProjectsPage/Projects'))
const Project = React.lazy(() => import('./components/Project/Project'))
const Jobs = React.lazy(() => import('./components/JobsPage/Jobs'))
const Artifacts = React.lazy(() => import('./components/Artifacts/Artifacts'))
const Functions = React.lazy(() =>
  import('./components/FunctionsPage/Functions')
)
const CreateJobPage = React.lazy(() =>
  import('./components/CreateJobPage/CreateJobPage')
)
const DataSets = React.lazy(() => import('./components/DataSets/DataSets'))
const Models = React.lazy(() => import('./components/Models/Models'))
const Files = React.lazy(() => import('./components/Files/Files'))

const App = () => {
  return (
    <Router>
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
              path="/projects/:projectName/jobs/:jobTab/:jobId/:tab"
              exact
              render={routeProps => <Jobs {...routeProps} />}
            />
            <Route
              path="/projects/:projectName/jobs/:jobTab"
              exact
              strict
              render={routeProps => <Jobs {...routeProps} />}
            />
            <Route
              exact
              path="/projects/:projectName/artifacts/:name/:tab"
              render={routeProps => <Artifacts {...routeProps} />}
            />
            <Route
              exact
              path="/projects/:projectName/artifacts"
              render={routeProps => <Artifacts {...routeProps} />}
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
              path="/projects/:projectName/jobs/:jobTab/create-new-job"
              exact
              strict
              render={routeProps => <CreateJobPage {...routeProps} />}
            />
            <Route
              exact
              path="/projects/:projectName/datasets"
              render={routeProps => <DataSets {...routeProps} />}
            />
            <Route
              exact
              path="/projects/:projectName/datasets/:name/:tab"
              render={routeProps => <DataSets {...routeProps} />}
            />
            <Route
              exact
              path="/projects/:projectName/models"
              render={routeProps => <Models {...routeProps} />}
            />
            <Route
              exact
              path="/projects/:projectName/models/:name/:tab"
              render={routeProps => <Models {...routeProps} />}
            />
            <Route
              exact
              path="/projects/:projectName/files"
              render={routeProps => <Files {...routeProps} />}
            />
            <Route
              exact
              path="/projects/:projectName/files/:name/:tab"
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
