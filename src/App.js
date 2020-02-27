import React, { Suspense } from 'react'
import {
  Redirect,
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import Page from './layout/Page/Page'

import './scss/main.scss'

const Projects = React.lazy(() => import('./components/ProjectsPage/Projects'))
const Jobs = React.lazy(() => import('./components/JobsPage/Jobs'))
const Artifacts = React.lazy(() => import('./components/Artifacts/Artifacts'))

const App = () => {
  return (
    <Router>
      <Page>
        <Suspense fallback={<p>Loading...</p>}>
          <Switch>
            <Route
              path="/projects"
              exact
              render={routeProps => <Projects {...routeProps} />}
            />
            <Route
              path="/projects/:projectName/jobs/:jobId/:tab"
              exact
              render={routeProps => <Jobs {...routeProps} />}
            />
            <Route
              path="/projects/:projectName/jobs"
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
            <Redirect to="/projects" />
          </Switch>
        </Suspense>
      </Page>
    </Router>
  )
}

export default App
