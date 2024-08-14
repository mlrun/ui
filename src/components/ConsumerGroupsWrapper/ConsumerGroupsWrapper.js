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
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Outlet } from 'react-router-dom'
import { useDispatch, connect } from 'react-redux'
import { isEmpty } from 'lodash'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import Loader from '../../common/Loader/Loader'

import nuclioActions from '../../actions/nuclio'
import { GROUP_BY_NONE } from '../../constants'
import { areNuclioStreamsEnabled } from '../../utils/helper'
import { setFilters } from '../../reducers/filtersReducer'
import { showErrorNotification } from '../../utils/notifications.util'

const ConsumerGroupsWrapper = ({
  fetchNuclioV3ioStreams,
  frontendSpec,
  resetV3ioStreamsError,
  v3ioStreams
}) => {
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()

  const nuclioStreamsAreEnabled = useMemo(
    () => areNuclioStreamsEnabled(frontendSpec),
    [frontendSpec]
  )

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch])

  const refreshConsumerGroups = useCallback(() => {
    setRequestErrorMessage('')
    fetchNuclioV3ioStreams(params.projectName)
  }, [fetchNuclioV3ioStreams, params.projectName])

  useEffect(() => {
    if (v3ioStreams.error) {
      showErrorNotification(
        dispatch,
        v3ioStreams.error,
        'Failed to fetch v3io streams',
        '',
        refreshConsumerGroups,
        setRequestErrorMessage
      )

      resetV3ioStreamsError()
    }
  }, [dispatch, v3ioStreams.error, refreshConsumerGroups, resetV3ioStreamsError])

  useEffect(() => {
    if (!isEmpty(frontendSpec) && !nuclioStreamsAreEnabled) {
      navigate(`/projects/${params.projectName}/monitor`)
    }
  }, [frontendSpec, navigate, nuclioStreamsAreEnabled, params.projectName, refreshConsumerGroups])

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
        <Outlet context={[ requestErrorMessage ]} />
      </div>
    </div>
  )
}

export default connect(
  ({ appStore, nuclioStore }) => ({
    frontendSpec: appStore.frontendSpec,
    v3ioStreams: nuclioStore.v3ioStreams
  }),
  {
    ...nuclioActions
  }
)(ConsumerGroupsWrapper)
