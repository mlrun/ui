import React, { Suspense } from 'react'
import {
  Redirect,
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import Header from './components/Header/Header'
import SideBar from './components/SideBar/SideBar'

import './scss/main.scss'

const Jobs = React.lazy(() => import('./components/JobsPage/Jobs'))
const Artifacts = React.lazy(() => import('./components/Arifacts/Artifacts'))

const App = () => {
  return (
    <Router>
      <Header />
      <SideBar />
      <main>
        <Suspense fallback={<p>Loading...</p>}>
          <Switch>
            <Route
              path="/jobs/:jobId"
              sensitive
              render={routeProps => <Jobs {...routeProps} />}
            />
            <Route
              path="/jobs"
              sensitive
              render={routeProps => <Jobs {...routeProps} />}
            />
            <Route
              path="/artifacts"
              sensitive
              render={routeProps => <Artifacts {...routeProps} />}
            />
            <Redirect to="/jobs" />
          </Switch>
        </Suspense>
      </main>
    </Router>
  )
}

export default App
