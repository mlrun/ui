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

import RealTimePipelinesView from './RealTimePipelinesView'

import { GROUP_BY_NAME, MODELS_PAGE, REAL_TIME_PIPELINES_TAB } from '../../../constants'
import { fetchArtifactsFunctions, removePipelines } from '../../../reducers/artifactsReducer'
import createFunctionsContent from '../../../utils/createFunctionsContent'
import { cancelRequest } from '../../../utils/cancelRequest'
import { generatePageData } from './realTimePipelines.util'
import { getFunctionIdentifier } from '../../../utils/getUniqueIdentifier'
import { setFilters } from '../../../reducers/filtersReducer'
import { useGroupContent } from '../../../hooks/groupContent.hook'
import { useModelsPage } from '../ModelsPage.context'

import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'

const RealTimePipelines = () => {
  const [pipelines, setPipelines] = useState([])
  const [selectedRowData, setSelectedRowData] = useState({})
  const artifactsStore = useSelector(store => store.artifactsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const pipelinesRef = useRef(null)
  const pageData = useMemo(() => generatePageData(params.pipelineId), [params.pipelineId])
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
      dispatch(fetchArtifactsFunctions({ project: params.projectName, filters }))
        .unwrap()
        .then(result => {
          setPipelines(
            result.filter(
              func =>
                !Object.keys(func.labels).some(labelKey => labelKey.includes('parent-function'))
            )
          )
        })
    },
    [dispatch, params.projectName]
  )

  const handleExpand = useCallback(
    (func, content) => {
      const funcIdentifier = getFunctionIdentifier(func)

      setSelectedRowData(state => {
        return {
          ...state,
          [funcIdentifier]: {
            content: createFunctionsContent(content[func.name], null, params.projectName, false)
          }
        }
      })
    },
    [params.projectName]
  )

  const handleCollapse = useCallback(
    func => {
      const funcIdentifier = getFunctionIdentifier(func)
      const newPageDataSelectedRowData = { ...selectedRowData }

      delete newPageDataSelectedRowData[funcIdentifier]

      setSelectedRowData(newPageDataSelectedRowData)
    },
    [selectedRowData]
  )

  const handleExpandAllCallback = (collapse, content) => {
    const newSelectedRowData = {}
    if (collapse) {
      setSelectedRowData({})
    } else {
      Object.entries(content).forEach(([key, value]) => {
        newSelectedRowData[key] = {
          content: createFunctionsContent(value, null, params.projectName, false)
        }
      })
    }

    setSelectedRowData(newSelectedRowData)
  }

  const { latestItems, handleExpandRow, expand, handleExpandAll } = useGroupContent(
    pipelines,
    getFunctionIdentifier,
    handleCollapse,
    handleExpand,
    null,
    MODELS_PAGE,
    REAL_TIME_PIPELINES_TAB,
    handleExpandAllCallback
  )

  const tableContent = useMemo(() => {
    return createFunctionsContent(latestItems, REAL_TIME_PIPELINES_TAB, params.projectName, true)
  }, [latestItems, params.projectName])

  useEffect(() => {
    fetchData({})
    dispatch(setFilters({ groupBy: GROUP_BY_NAME }))
  }, [dispatch, fetchData])

  useEffect(() => {
    return () => {
      setPipelines([])
      dispatch(removePipelines())
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
