/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
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
