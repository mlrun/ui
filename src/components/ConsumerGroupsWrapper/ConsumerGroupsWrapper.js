import React, { useCallback, useEffect, useMemo } from 'react'
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import ConsumerGroup from '../ConsumerGroup/ConsumerGroup'
import ConsumerGroups from '../ConsumerGroups/ConsumerGroups'
import Loader from '../../common/Loader/Loader'

import filtersActions from '../../actions/filters'
import notificationActions from '../../actions/notification'
import nuclioActions from '../../actions/nuclio'
import { GROUP_BY_NONE } from '../../constants'
import { isProjectValid } from '../../utils/handleRedirect'
import { areNuclioStreamsEnabled } from '../../utils/helper'

const ConsumerGroupsWrapper = ({
  fetchNuclioV3ioStreams,
  frontendSpec,
  match,
  projectsNames,
  resetV3ioStreamsError,
  setFilters,
  setNotification,
  v3ioStreams
}) => {
  let { path } = useRouteMatch()
  const history = useHistory()

  const nuclioStreamsAreEnabled = useMemo(
    () => areNuclioStreamsEnabled(frontendSpec),
    [frontendSpec]
  )

  useEffect(() => {
    isProjectValid(history, projectsNames.data, match.params.projectName)
  }, [history, match.params.projectName, projectsNames.data])

  useEffect(() => {
    setFilters({ groupBy: GROUP_BY_NONE })
  }, [setFilters])

  const refreshConsumerGroups = useCallback(() => {
    fetchNuclioV3ioStreams(match.params.projectName)
  }, [fetchNuclioV3ioStreams, match.params.projectName])

  useEffect(() => {
    if (v3ioStreams.error) {
      setNotification({
        status: v3ioStreams.error?.response?.status || 400,
        id: Math.random(),
        message: 'Failed to fetch v3io streams',
        retry: () => refreshConsumerGroups()
      })

      resetV3ioStreamsError()
    }
  }, [
    v3ioStreams.error,
    refreshConsumerGroups,
    resetV3ioStreamsError,
    setNotification
  ])

  useEffect(() => {
    if (!isEmpty(frontendSpec) && !nuclioStreamsAreEnabled) {
      history.push(`/projects/${match.params.projectName}/monitor`)
    }
  }, [
    frontendSpec,
    history,
    nuclioStreamsAreEnabled,
    match.params.projectName,
    refreshConsumerGroups
  ])

  useEffect(() => {
    if (nuclioStreamsAreEnabled) {
      refreshConsumerGroups()
    }
  }, [nuclioStreamsAreEnabled, refreshConsumerGroups])

  if (isEmpty(frontendSpec)) {
    return <Loader />
  }

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
  ({ appStore, nuclioStore, projectStore }) => ({
    frontendSpec: appStore.frontendSpec,
    v3ioStreams: nuclioStore.v3ioStreams,
    projectsNames: projectStore.projectsNames
  }),
  {
    ...filtersActions,
    ...notificationActions,
    ...nuclioActions
  }
)(ConsumerGroupsWrapper)
