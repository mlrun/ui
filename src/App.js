import React, { Suspense } from 'react'
import { NavLink, Redirect, Route, Switch, withRouter } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import makeStyles from '@material-ui/core/styles/makeStyles'

import CheckAllIcon from 'mdi-material-ui/CheckAll'
import FileChartIcon from 'mdi-material-ui/FileChart'
import GithubCircleIcon from 'mdi-material-ui/GithubCircle'

import logo from './images/iguazio-logo-corner.png'
import './App.css'

const Jobs = React.lazy(() => import('./routes/Jobs'))
const Artifacts = React.lazy(() => import('./routes/Artifacts'))

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  drawer: {
    width: '150px'
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    display: 'flex',
    flexFlow: 'column nowrap',
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    padding: theme.spacing(1)
  },
  activeLink: {
    backgroundColor: theme.palette.grey[400]
  },
  logo: {
    width: '43px',
    height: '43px'
  },
  mainPaper: {
    flexGrow: 1,
    flexShrink: 0,
    minHeight: '300px'
  },
  title: {
    flex: 'auto'
  }
}))

function App() {
  const classes = useStyles()

  const JobsLink = React.forwardRef((props, ref) => (
    <NavLink
      ref={ref}
      to="/jobs"
      {...props}
      activeClassName={classes.activeLink}
    />
  ))
  const ArtifactsLink = React.forwardRef((props, ref) => (
    <NavLink
      ref={ref}
      to="/artifacts"
      {...props}
      activeClassName={classes.activeLink}
    />
  ))

  const routes = (
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
  )
  return (
    <div className={classes.root}>
      <AppBar position="fixed" variant="dense" color="secondary">
        <Toolbar>
          <a
            href="https://iguazio.com/"
            target="_blank"
            rel="noopener noreferrer"
            title="Iguazio Data-Science Platform"
          >
            <img src={logo} alt="Iguazio Logo" className={classes.logo} />
          </a>
          <Typography variant="h5" noWrap className={classes.title}>
            <Box fontWeight="fontWeightBold" component="span">
              MLRun
            </Box>
            <Box fontWeight="fontWeightLight" component="span">
              UI
            </Box>
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            href="https://github.com/mlrun/mlrun"
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<GithubCircleIcon />}
          >
            See on GitHub
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" className={classes.drawer}>
        <div className={classes.appBarSpacer} />
        <List>
          <ListItem button component={JobsLink}>
            <ListItemIcon>
              <CheckAllIcon />
            </ListItemIcon>
            <ListItemText primary="Jobs" />
          </ListItem>
          <ListItem button component={ArtifactsLink}>
            <ListItemIcon>
              <FileChartIcon />
            </ListItemIcon>
            <ListItemText primary="Artifacts" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Paper className={classes.mainPaper}>
          <Suspense fallback={<p>Loading…</p>}>{routes}</Suspense>
        </Paper>
      </main>
    </div>
  )
}

export default withRouter(App)
