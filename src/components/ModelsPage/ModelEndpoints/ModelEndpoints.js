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
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { orderBy } from 'lodash'

import ModelEndpointsView from './ModelEndpointsView'

import { generatePageData } from './modelEndpoints.util'
import { useModelsPage } from '../ModelsPage.context'
import artifactsAction from '../../../actions/artifacts'
import { GROUP_BY_NONE, MODEL_ENDPOINTS_TAB } from '../../../constants'
import filtersActions from '../../../actions/filters'
import detailsActions from '../../../actions/details'
import { isDetailsTabExists } from '../../../utils/isDetailsTabExists'
import { createModelEndpointsRowData } from '../../../utils/createArtifactsContent'
import { cancelRequest } from '../../../utils/cancelRequest'

import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'

const ModelEndpoints = () => {
  const [modelEndpoints, setModelEndpoints] = useState([])
  const [selectedModelEndpoint, setSelectedModelEndpoint] = useState({})
  const artifactsStore = useSelector(store => store.artifactsStore)
  const detailsStore = useSelector(store => store.detailsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const modelEndpointsRef = useRef(null)
  const pageData = useMemo(
    () => generatePageData(detailsStore.modelEndpoint.data),
    [detailsStore.modelEndpoint.data]
  )
  const { toggleConvertedYaml } = useModelsPage()

  const actionsMenu = useMemo(
    () => [
      {
        label: 'View YAML',
        icon: <Yaml />,
        onClick: toggleConvertedYaml
      }
    ],
    [toggleConvertedYaml]
  )

  const fetchData = useCallback(
    filters => {
      dispatch(
        artifactsAction.fetchModelEndpoints(params.projectName, filters, {
          metric: 'latency_avg_1h',
          start: 'now-10m'
        })
      ).then(result => {
        setModelEndpoints(result)
      })
    },
    [dispatch, params.projectName]
  )

  const handleSelectItem = useCallback(
    modelEndpoint => {
      dispatch(
        detailsActions.fetchModelEndpointWithAnalysis(
          params.projectName,
          modelEndpoint.metadata.uid
        )
      )
      setSelectedModelEndpoint(modelEndpoint)
    },
    [dispatch, params.projectName]
  )

  useEffect(() => {
    fetchData({})
    dispatch(filtersActions.setFilters({ groupBy: GROUP_BY_NONE, sortBy: 'function' }))
  }, [dispatch, fetchData])

  useEffect(() => {
    return () => {
      setModelEndpoints([])
      dispatch(artifactsAction.removeModelEndpoints())
      setSelectedModelEndpoint({})
      cancelRequest(modelEndpointsRef, 'cancel')
    }
  }, [dispatch])

  useEffect(() => {
    if (params.name && modelEndpoints.length > 0) {
      const searchItem = modelEndpoints.find(item => item.metadata?.uid === params.tag)

      if (!searchItem) {
        navigate(`/projects/${params.projectName}/models/${MODEL_ENDPOINTS_TAB}`, { replace: true })
      } else if (searchItem.metadata.uid !== selectedModelEndpoint.metadata?.uid) {
        handleSelectItem(searchItem)
      }
    } else {
      setSelectedModelEndpoint({})
    }
  }, [
    dispatch,
    handleSelectItem,
    modelEndpoints,
    navigate,
    params.name,
    params.projectName,
    params.tag,
    selectedModelEndpoint.metadata?.uid
  ])

  useEffect(() => {
    if (params.name && params.tag && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, location, pageData.details.menu, params.name, params.tag, params.tab])

  const sortedContent = useMemo(() => {
    const path = filtersStore.sortBy === 'function' ? 'spec.model_uri' : 'spec.model'

    return orderBy(modelEndpoints, [path], ['asc'])
  }, [modelEndpoints, filtersStore.sortBy])

  const tableContent = useMemo(() => {
    return sortedContent.map(contentItem =>
      createModelEndpointsRowData(contentItem, params.projectName)
    )
  }, [params.projectName, sortedContent])

  return (
    <ModelEndpointsView
      actionsMenu={actionsMenu}
      artifactsStore={artifactsStore}
      fetchData={fetchData}
      filtersStore={filtersStore}
      modelEndpoints={modelEndpoints}
      pageData={pageData}
      ref={modelEndpointsRef}
      selectedModelEndpoint={selectedModelEndpoint}
      setSelectedModelEndpoint={handleSelectItem}
      tableContent={tableContent}
    />
  )
}

export default ModelEndpoints
