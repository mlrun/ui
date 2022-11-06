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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { flatten, map } from 'lodash'

import RealTimePipelinesView from './RealTimePipelinesView'

import { generatePageData } from './realTimePipelines.util'
import { ModelsPageContext } from '../modelsPage.util'
import artifactsAction from '../../../actions/artifacts'
import filtersActions from '../../../actions/filters'
import { GROUP_BY_NAME, MODELS_PAGE, REAL_TIME_PIPELINES_TAB } from '../../../constants'
import { cancelRequest } from '../../../utils/cancelRequest'
import { useGroupContent } from '../../../hooks/groupContent.hook'
import createFunctionsContent from '../../../utils/createFunctionsContent'
import { getFunctionIdentifier } from '../../../utils/getUniqueIdentifier'

import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'

const RealTimePipelines = () => {
  const [pipelines, setPipelines] = useState([])
  const artifactsStore = useSelector(store => store.artifactsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const pipelinesRef = useRef(null)
  const pageData = useMemo(() => generatePageData(params.pipelineId), [params.pipelineId])
  const { toggleConvertedYaml } = React.useContext(ModelsPageContext)

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
        artifactsAction.fetchFunctions(params.projectName, filters, {
          metric: 'latency_avg_1h',
          start: 'now-10m'
        })
      ).then(result => {
        setPipelines(result)
      })
    },
    [dispatch, params.projectName]
  )

  const { latestItems, handleExpandRow, groupedContent, expand, handleExpandAll } = useGroupContent(
    pipelines,
    getFunctionIdentifier,
    null,
    null,
    MODELS_PAGE,
    REAL_TIME_PIPELINES_TAB
  )

  const tableContent = useMemo(() => {
    return createFunctionsContent(
      latestItems,
      false,
      REAL_TIME_PIPELINES_TAB,
      params.projectName,
      true
    )
  }, [latestItems, params.projectName])

  const selectedRowData = useMemo(() => {
    return flatten(
      map(groupedContent, group =>
        createFunctionsContent(group, false, REAL_TIME_PIPELINES_TAB, params.projectName, false)
      )
    )
  }, [groupedContent, params.projectName])

  useEffect(() => {
    fetchData({})
    dispatch(filtersActions.setFilters({ groupBy: GROUP_BY_NAME }))
  }, [dispatch, fetchData])

  useEffect(() => {
    return () => {
      setPipelines([])
      dispatch(artifactsAction.removePipelines())
      cancelRequest(pipelinesRef, 'cancel')
    }
  }, [dispatch])

  useEffect(() => {
    if (params.pipelineId && pipelines.length > 0) {
      if (!pipelines.find(item => item.hash === params.pipelineId)) {
        navigate(`/projects/${params.projectName}/models/${REAL_TIME_PIPELINES_TAB}`, {
          replace: true
        })
      }
    }
  }, [navigate, params.pipelineId, params.projectName, pipelines])

  return (
    <RealTimePipelinesView
      actionsMenu={actionsMenu}
      artifactsStore={artifactsStore}
      expand={expand}
      fetchData={fetchData}
      filtersStore={filtersStore}
      handleExpandAll={handleExpandAll}
      handleExpandRow={handleExpandRow}
      pageData={pageData}
      params={params}
      pipelines={pipelines}
      selectedRowData={selectedRowData}
      tableContent={tableContent}
    />
  )
}

export default RealTimePipelines
