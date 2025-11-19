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
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'

import { Loader } from 'igz-controls/components'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'

import { GROUP_BY_NONE } from '../../constants'
import { areNuclioStreamsEnabled } from '../../utils/helper'
import { fetchNuclioV3ioStreams, resetV3ioStreamsError } from '../../reducers/nuclioReducer'
import { setFilters } from '../../reducers/filtersReducer'
import { showErrorNotification } from 'igz-controls/utils/notification.util'

const ConsumerGroupsWrapper = () => {
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const navigate = useNavigate()
  const params = useParams()
  const frontendSpec = useSelector(state => state.appStore.frontendSpec)
  const v3ioStreams = useSelector((store) => store.nuclioStore.v3ioStreams)
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
    dispatch(fetchNuclioV3ioStreams({ project: params.projectName }))
  }, [dispatch, params.projectName])

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

      dispatch(resetV3ioStreamsError())
    }
  }, [dispatch, v3ioStreams.error, refreshConsumerGroups])

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
        <Breadcrumbs itemName={params.streamName} />
      </div>
      <div className="page-content">
        <Outlet context={[requestErrorMessage]} />
      </div>
    </div>
  )
}

export default ConsumerGroupsWrapper
