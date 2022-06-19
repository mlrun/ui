import React, { useCallback, useEffect, useMemo } from 'react'
import { useNavigate, useParams, Outlet } from 'react-router-dom'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
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
  projectsNames,
  resetV3ioStreamsError,
  setFilters,
  setNotification,
  v3ioStreams
}) => {
  const navigate = useNavigate()
  const params = useParams()

  const nuclioStreamsAreEnabled = useMemo(
    () => areNuclioStreamsEnabled(frontendSpec),
    [frontendSpec]
  )

  useEffect(() => {
    isProjectValid(navigate, projectsNames.data,params.projectName)
  }, [navigate, params.projectName, projectsNames.data])

  useEffect(() => {
    setFilters({ groupBy: GROUP_BY_NONE })
  }, [setFilters])

  const refreshConsumerGroups = useCallback(() => {
    fetchNuclioV3ioStreams(params.projectName)
  }, [fetchNuclioV3ioStreams, params.projectName])

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
      navigate(`/projects/${params.projectName}/monitor`)
    }
  }, [
    frontendSpec,
    navigate,
    nuclioStreamsAreEnabled,
    params.projectName,
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
        <Breadcrumbs />
      </div>
      <div className="page-content">
        <Outlet/>
      </div>
    </div>
  )
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
