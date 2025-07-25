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
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import classnames from 'classnames'
import { isNil } from 'lodash'

import ActionBar from '../../ActionBar/ActionBar'
import ModelsPageTabs from '../ModelsPageTabs/ModelsPageTabs'
import NoData from '../../../common/NoData/NoData'
import Pipeline from '../../Pipeline/Pipeline'
import RealTimePipelinesTableRow from '../../../elements/RealTimePipelinesTableRow/RealTimePipelinesTableRow'
import Table from '../../Table/Table'
import { Loader } from 'igz-controls/components'

import {
  GROUP_BY_NAME,
  MODELS_PAGE,
  REAL_TIME_PIPELINES_TAB,
  REQUEST_CANCELED
} from '../../../constants'
import createRealTimePipelinesContent from '../../../utils/createRealTimePipelinesContent'
import { fetchAndParseFunction, filtersConfig, generatePageData } from './realTimePipelines.util'
import { fetchArtifactsFunctions, removePipelines } from '../../../reducers/artifactsReducer'
import { getNoDataMessage } from '../../../utils/getNoDataMessage'
import { getScssVariableValue } from 'igz-controls/utils/common.util'
import { isRowRendered, useVirtualization } from '../../../hooks/useVirtualization.hook'
import { setFilters } from '../../../reducers/filtersReducer'
import { useFiltersFromSearchParams } from '../../../hooks/useFiltersFromSearchParams.hook'
import { useInitialTableFetch } from '../../../hooks/useInitialTableFetch.hook'
import { useModelsPage } from '../ModelsPage.context'

import Yaml from 'igz-controls/images/yaml.svg?react'

import './realTimePipelines.scss'

const RealTimePipelines = () => {
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [pipelines, setPipelines] = useState([])
  const artifactsStore = useSelector(store => store.artifactsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const abortControllerRef = useRef(new AbortController())
  const pipelinesRef = useRef(null)
  const pageData = useMemo(() => generatePageData(params.pipelineId), [params.pipelineId])
  const { toggleConvertedYaml } = useModelsPage()
  const [, setSearchParams] = useSearchParams()
  const filters = useFiltersFromSearchParams(filtersConfig)

  const pipelinesRowHeight = useMemo(() => getScssVariableValue('--pipelinesRowHeight'), [])
  const pipelinesRowHeightExtended = useMemo(
    () => getScssVariableValue('--pipelinesRowHeightExtended'),
    []
  )
  const pipelinesHeaderRowHeight = useMemo(
    () => getScssVariableValue('--pipelinesHeaderRowHeight'),
    []
  )

  const filterMenuClassNames = classnames(
    'content__action-bar-wrapper',
    params.pipelineId && 'content__action-bar-wrapper_hidden'
  )

  const actionsMenu = useMemo(
    () => [
      [
        {
          label: 'View YAML',
          icon: <Yaml />,
          onClick: func =>
            fetchAndParseFunction(func, dispatch).then(() => toggleConvertedYaml(func))
        }
      ]
    ],
    [dispatch, toggleConvertedYaml]
  )

  const fetchData = useCallback(
    filters => {
      abortControllerRef.current = new AbortController()

      dispatch(
        fetchArtifactsFunctions({
          project: params.projectName,
          filters,
          config: {
            params: { format: 'minimal', kind: 'serving' },
            ui: {
              controller: abortControllerRef.current,
              setRequestErrorMessage
            }
          }
        })
      )
        .unwrap()
        .then(result => {
          if (!isNil(result)) {
            setPipelines(
              result.filter(
                func =>
                  !Object.keys(func.labels).some(labelKey => labelKey.includes('parent-function'))
              )
            )
          }
        })
    },
    [dispatch, params.projectName]
  )

  const handleRefresh = useCallback(
    filters => {
      setPipelines([])

      return fetchData(filters)
    },
    [fetchData]
  )

  const tableContent = useMemo(() => {
    return createRealTimePipelinesContent(pipelines, params.projectName)
  }, [pipelines, params.projectName])

  const fetchInitialData = useCallback(
    filters => {
      fetchData(filters)
      dispatch(setFilters({ groupBy: GROUP_BY_NAME }))
    },
    [dispatch, fetchData]
  )

  useInitialTableFetch({ fetchData: fetchInitialData, filters })

  useEffect(() => {
    return () => {
      setPipelines([])
      dispatch(removePipelines())
      abortControllerRef.current.abort(REQUEST_CANCELED)
    }
  }, [dispatch])

  useEffect(() => {
    if (params.pipelineId && pipelines.length > 0) {
      if (!pipelines.find(item => item.hash === params.pipelineId)) {
        navigate(
          `/projects/${params.projectName}/models/${REAL_TIME_PIPELINES_TAB}${window.location.search}`,
          {
            replace: true
          }
        )
      }
    }
  }, [navigate, params.pipelineId, params.projectName, pipelines])

  const virtualizationConfig = useVirtualization({
    rowsData: {
      content: tableContent
    },
    renderTriggerItem: params.pipelineId,
    heightData: {
      headerRowHeight: pipelinesHeaderRowHeight,
      rowHeight: pipelinesRowHeight,
      rowHeightExtended: pipelinesRowHeightExtended
    }
  })

  return (
    <>
      {artifactsStore.pipelines.loading && <Loader />}
      <div className="models" ref={pipelinesRef}>
        <div className="table-container">
          <div className={filterMenuClassNames}>
            <ModelsPageTabs />
            <ActionBar
              closeParamName={REAL_TIME_PIPELINES_TAB}
              filters={filters}
              filtersConfig={filtersConfig}
              handleRefresh={handleRefresh}
              setSearchParams={setSearchParams}
              tab={REAL_TIME_PIPELINES_TAB}
              withoutExpandButton
            />
          </div>
          {artifactsStore.pipelines.loading ? null : pipelines.length === 0 ? (
            <NoData
              message={getNoDataMessage(
                filters,
                filtersConfig,
                requestErrorMessage,
                MODELS_PAGE,
                REAL_TIME_PIPELINES_TAB,
                filtersStore
              )}
            />
          ) : params.pipelineId ? (
            <Pipeline content={pipelines} />
          ) : (
            <>
              <Table
                actionsMenu={actionsMenu}
                pageData={pageData}
                selectedItem={{}}
                tab={REAL_TIME_PIPELINES_TAB}
                tableClassName="pipelines-table"
                tableHeaders={tableContent[0]?.content ?? []}
                virtualizationConfig={virtualizationConfig}
              >
                {tableContent.map(
                  (tableItem, index) =>
                    isRowRendered(virtualizationConfig, index) && (
                      <RealTimePipelinesTableRow
                        actionsMenu={actionsMenu}
                        key={index}
                        rowItem={tableItem}
                      />
                    )
                )}
              </Table>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default RealTimePipelines
