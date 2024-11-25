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
import classnames from 'classnames'
import { isNil } from 'lodash'

import Loader from '../../../common/Loader/Loader'
import ModelsPageTabs from '../ModelsPageTabs/ModelsPageTabs'
import NoData from '../../../common/NoData/NoData'
import Pipeline from '../../Pipeline/Pipeline'
import RealTimePipelinesTableRow from '../../../elements/RealTimePipelinesTableRow/RealTimePipelinesTableRow'
import Table from '../../Table/Table'
import ActionBar from '../../ActionBar/ActionBar'

import {
  GROUP_BY_NAME,
  MODELS_PAGE,
  REAL_TIME_PIPELINES_TAB,
  REQUEST_CANCELED
} from '../../../constants'
import createRealTimePipelinesContent from '../../../utils/createRealTimePipelinesContent'
import { fetchArtifactsFunctions, removePipelines } from '../../../reducers/artifactsReducer'
import { filtersConfig, generatePageData } from './realTimePipelines.util'
import { getNoDataMessage } from '../../../utils/getNoDataMessage'
import { isRowRendered, useVirtualization } from '../../../hooks/useVirtualization.hook'
import { setFilters } from '../../../reducers/filtersReducer'
import { useModelsPage } from '../ModelsPage.context'
import { useFiltersFromSearchParams } from '../../../hooks/useFiltersFromSearchParams.hook'
import { useInitialTableFetch } from '../../../hooks/useInitialTableFetch.hook'

import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'

import cssVariables from './realTimePipelines.scss'

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
  const filters = useFiltersFromSearchParams(filtersConfig)

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
          onClick: toggleConvertedYaml
        }
      ]
    ],
    [toggleConvertedYaml]
  )

  const fetchData = useCallback(
    filters => {
      abortControllerRef.current = new AbortController()

      dispatch(
        fetchArtifactsFunctions({
          project: params.projectName,
          filters,
          config: {
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

  const handleRefreshWithFilters = useCallback(() => {
    handleRefresh(filters)
  }, [filters, handleRefresh])

  const tableContent = useMemo(() => {
    return createRealTimePipelinesContent(pipelines, params.projectName, toggleConvertedYaml)
  }, [pipelines, params.projectName, toggleConvertedYaml])

  const fetchInitialData = useCallback(
    filters => {
      fetchData(filters)
      dispatch(setFilters({ groupBy: GROUP_BY_NAME }))
    },
    [dispatch, fetchData]
  )

  useInitialTableFetch({fetchData: fetchInitialData, filters })


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
        navigate(`/projects/${params.projectName}/models/${REAL_TIME_PIPELINES_TAB}${window.location.search}`, {
          replace: true
        })
      }
    }
  }, [navigate, params.pipelineId, params.projectName, pipelines])

  const virtualizationConfig = useVirtualization({
    rowsData: {
      content: tableContent
    },
    renderTriggerItem: params.pipelineId,
    heightData: {
      headerRowHeight: cssVariables.pipelinesHeaderRowHeight,
      rowHeight: cssVariables.pipelinesRowHeight,
      rowHeightExtended: cssVariables.pipelinesRowHeightExtended
    }
  })

  return (
    <>
      {artifactsStore.pipelines.loading && <Loader />}
      <div className="models" ref={pipelinesRef}>
        <div className="table-container">
          <div className={filterMenuClassNames}>
            <ModelsPageTabs />
            <div className="action-bar">
              <ActionBar
                filters={filters}
                filtersConfig={filtersConfig}
                handleRefresh={handleRefresh}
                navigateLink={`/projects/${params.projectName}/models/${REAL_TIME_PIPELINES_TAB}${window.location.search}`}
                page={MODELS_PAGE}
                tab={REAL_TIME_PIPELINES_TAB}
                withoutExpandButton
              />
            </div>
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
                retryRequest={handleRefreshWithFilters}
                selectedItem={{}}
                tab={REAL_TIME_PIPELINES_TAB}
                tableClassName="pipelines-table"
                tableHeaders={tableContent[0]?.content ?? []}
                toggleConvertedYaml={toggleConvertedYaml}
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
