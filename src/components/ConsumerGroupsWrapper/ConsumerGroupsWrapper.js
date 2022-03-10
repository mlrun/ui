import React, { useCallback, useEffect } from 'react'
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import ConsumerGroup from '../ConsumerGroup/ConsumerGroup'
import ConsumerGroups from '../ConsumerGroups/ConsumerGroups'

import filtersActions from '../../actions/filters'
import notificationActions from '../../actions/notification'
import nuclioActions from '../../actions/nuclio'
import projectsAction from '../../actions/projects'
import { GROUP_BY_NONE } from '../../constants'
import { isProjectValid } from '../../utils/handleRedirect'

const ConsumerGroupsWrapper = ({
  fetchNuclioV3ioStreams,
  match,
  nuclioStore,
  projectStore,
  resetV3ioStreamsError,
  setFilters,
  setNotification
}) => {
  let { path } = useRouteMatch()
  const history = useHistory()

  useEffect(() => {
    isProjectValid(
      history,
      projectStore.projectsNames.data,
      match.params.projectName
    )
  }, [history, match.params.projectName, projectStore.projectsNames.data])

  useEffect(() => {
    setFilters({ groupBy: GROUP_BY_NONE })
  }, [setFilters])

  const refreshConsumerGroups = useCallback(() => {
    fetchNuclioV3ioStreams(match.params.projectName)
  }, [fetchNuclioV3ioStreams, match.params.projectName])

  useEffect(() => {
    if (nuclioStore.v3ioStreams.error) {
      setNotification({
        status: nuclioStore.v3ioStreams.error?.response?.status || 400,
        id: Math.random(),
        message: 'Failed to fetch v3io streams',
        retry: () => refreshConsumerGroups()
      })

      resetV3ioStreamsError()
    }
  }, [
    nuclioStore.v3ioStreams.error,
    refreshConsumerGroups,
    resetV3ioStreamsError,
    setNotification
  ])

  useEffect(() => {
    refreshConsumerGroups()
  }, [refreshConsumerGroups])

  return (
    <div className="page">
      <div className="page-breadcrumbs">
        <Breadcrumbs match={match} />
      </div>
      <div className="page-content">
        <Switch>
          <Route
            path={path}
            exact
            render={routeProps => <ConsumerGroups {...routeProps} />}
          />
          <Route
            path={`${path}/:consumerGroupName`}
            exact
            render={routeProps => <ConsumerGroup {...routeProps} />}
          />
        </Switch>
      </div>
    </div>
  )
}

ConsumerGroupsWrapper.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(
  ({ nuclioStore, projectStore }) => ({
    nuclioStore,
    projectStore
  }),
  {
    ...filtersActions,
    ...notificationActions,
    ...nuclioActions,
    ...projectsAction
  }
)(ConsumerGroupsWrapper)
