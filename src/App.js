import React, { Suspense } from 'react'
import {
  Redirect,
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
// import { connect } from 'react-redux'
//
// import logo from './images/iguazio-logo-corner.png'
import './App.css'
import Header from './components/Header/Header'
import SideBar from './components/SideBar/SideBar'

const Jobs = React.lazy(() => import('./components/JobsPage/Jobs'))
const Artifacts = React.lazy(() => import('./routes/Artifacts'))

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
      {/*<Route exact path="/" render={(props) => (usersStore.isAuth ? <Redirect to="/dashboard"/> : <HomePage {...props}/>)}/>*/}
    </Router>
  )
}

export default App
