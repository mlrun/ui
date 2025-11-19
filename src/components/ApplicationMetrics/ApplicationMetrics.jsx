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
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { debounce, isEmpty } from 'lodash'
import { createForm } from 'final-form'
import { Form } from 'react-final-form'
import classNames from 'classnames'

import HistoryBackLink from '../../common/HistoryBackLink/historyBackLink'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import DetailsMetrics from '../DetailsMetrics/DetailsMetrics'
import NoData from '../../common/NoData/NoData'
import {
  Button,
  FormInput,
  FormOnChange,
  RoundedIcon,
  TextTooltipTemplate,
  Tooltip,
  Loader
} from 'igz-controls/components'

import { fetchModelEndpoints } from '../../reducers/artifactsReducer'
import {
  DATES_FILTER,
  DETAILS_OVERVIEW_TAB,
  MODEL_ENDPOINTS_TAB,
  MODELS_PAGE,
  MONITORING_APP_PAGE,
  REQUEST_CANCELED
} from '../../constants'
import { getScssVariableValue } from 'igz-controls/utils/common.util'
import { isRowRendered, useVirtualization } from '../../hooks/useVirtualization.hook'
import { fetchMonitoringApplication } from '../../reducers/monitoringApplicationsReducer'
import { PRIMARY_BUTTON } from 'igz-controls/constants'

import RefreshIcon from 'igz-controls/images/refresh.svg?react'
import SearchIcon from 'igz-controls/images/search.svg?react'
import PresentMetricsIcon from 'igz-controls/images/present-metrics-icon.svg?react'
import {
  datePickerPastOptions,
  getDatePickerFilterValue,
  PAST_24_HOUR_DATE_OPTION
} from '../../utils/datePicker.util'
import { clearMetricsOptions } from '../../reducers/detailsReducer'

import './ApplicationMetrics.scss'

export const LIST_ID = 'LIST_ID'
export const LIST_ITEMS_ID = 'LIST_ITEMS_ID'

const ApplicationMetrics = () => {
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [selectedModelEndpoint, setSelectedModelEndpoint] = useState({})
  const [modelEndpoints, setModelEndpoints] = useState([])
  const [searchName, setSearchName] = useState('')
  const detailsStore = useSelector(store => store.detailsStore)
  const artifactsStore = useSelector(store => store.artifactsStore)
  const applicationsStore = useSelector(store => store.monitoringApplicationsStore)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()
  const abortControllerRef = useRef()

  const filteredEndpoints = useMemo(() => {
    return modelEndpoints.filter(modelEndpoint => {
      return !searchName || modelEndpoint.name?.toLowerCase()?.includes(searchName.toLowerCase())
    })
  }, [modelEndpoints, searchName])

  const listItemHeight = useMemo(() => getScssVariableValue('--listItemHeight'), [])
  const searchHeight = useMemo(() => getScssVariableValue('--searchHeight'), [])

  const rowsSizes = useMemo(
    () => new Array(filteredEndpoints.length).fill(parseInt(listItemHeight)),
    [listItemHeight, filteredEndpoints.length]
  )
  const heightData = useMemo(
    () => ({
      headerRowHeight: searchHeight,
      rowHeight: listItemHeight,
      rowHeightExtended: listItemHeight
    }),
    [listItemHeight, searchHeight]
  )

  const virtualizationConfig = useVirtualization({
    renderTriggerItem: modelEndpoints,
    heightData,
    rowsSizes,
    tableBodyId: LIST_ID,
    tableId: LIST_ITEMS_ID
  })

  const formRef = React.useRef(
    createForm({
      initialValues: {
        MEPSearchName: ''
      },
      onSubmit: () => { }
    })
  )

  const fetchModelEndpointsData = useCallback(() => {
    abortControllerRef.current = new AbortController()

    dispatch(
      fetchModelEndpoints({
        project: params.projectName,
        filters: {},
        config: {
          ui: {
            controller: abortControllerRef.current,
            setRequestErrorMessage
          }
        },
        params: {
          latest_only: 'True'
        }
      })
    )
      .unwrap()
      .then(modelEndpoints => {
        if (modelEndpoints) {
          setModelEndpoints(modelEndpoints)
        }
      })
  }, [dispatch, params.projectName])

  const setSearchNameDebounced = useMemo(
    () =>
      debounce(name => {
        setSearchName(name)
      }, 500),
    [setSearchName]
  )

  useEffect(() => {
    if (
      applicationsStore.monitoringApplications.applications?.find(
        app => app.name.toLowerCase() === params.appName.toLowerCase()
      )
    ) {
      fetchModelEndpointsData()
    } else {
      dispatch(
        fetchMonitoringApplication({
          project: params.projectName,
          functionName: params.appName,
          filters: {
            [DATES_FILTER]: getDatePickerFilterValue(
              datePickerPastOptions,
              PAST_24_HOUR_DATE_OPTION,
              false
            )
          }
        })
      )
        .unwrap()
        .then(app => {
          if (!isEmpty(app)) {
            fetchModelEndpointsData()
          } else {
            navigate(
              `/projects/${params.projectName}/${MONITORING_APP_PAGE}${window.location.search}`,
              { replace: true }
            )
          }
        })
        .catch(() => {
          navigate(
            `/projects/${params.projectName}/${MONITORING_APP_PAGE}${window.location.search}`,
            { replace: true }
          )
        })
    }

    return () => {
      abortControllerRef.current?.abort?.(REQUEST_CANCELED)
    }

    // navigate triggers this use effect when we select first item in the list if id is not in the URL
    // if adding new deps, please double check it by removing next comment
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    applicationsStore.monitoringApplications.applications,
    dispatch,
    fetchModelEndpointsData,
    params.appName,
    params.projectName
  ])

  useEffect(() => {
    if (params.id && modelEndpoints.length > 0) {
      const searchItem = modelEndpoints.find(item => item.metadata?.uid === params.id)

      if (!searchItem) {
        navigate(
          `/projects/${params.projectName}/${MONITORING_APP_PAGE}/${params.appName}/${MODEL_ENDPOINTS_TAB}/${modelEndpoints[0].metadata.uid}${window.location.search}`,
          { replace: true }
        )
      } else {
        setSelectedModelEndpoint(searchItem)
      }
    } else if (modelEndpoints.length > 0) {
      navigate(
        `/projects/${params.projectName}/${MONITORING_APP_PAGE}/${params.appName}/${MODEL_ENDPOINTS_TAB}/${modelEndpoints[0].metadata.uid}${window.location.search}`,
        { replace: true }
      )
    } else {
      setSelectedModelEndpoint({})
    }
  }, [dispatch, modelEndpoints, navigate, params.id, params.appName, params.projectName])

  useEffect(() => {
    return () => {
      dispatch(clearMetricsOptions())
    }
  }, [dispatch])

  return (
    <div className="content-wrapper applications-metrics">
      <div className="content__header">
        <Breadcrumbs itemName={params.appName} />
      </div>
      <div className="content">
        <div className="application-metrics-container">
          <div className="content__action-bar-wrapper">
            <HistoryBackLink
              link={`/projects/${params.projectName}/${MONITORING_APP_PAGE}/${params.appName}${window.location.search}`}
              itemName={params.appName}
              customText='Applications metrics'
              customIcon={<PresentMetricsIcon />}
            />
            <div className="action-bar">
              <Button
                variant={PRIMARY_BUTTON}
                label="Application monitoring"
                className="action-button"
                onClick={() => {
                  navigate(
                    `/projects/${params.projectName}/${MONITORING_APP_PAGE}/${params.appName}${window.location.search}`
                  )
                }}
                icon={<PresentMetricsIcon />}
              />
              <RoundedIcon tooltipText="Refresh" onClick={fetchModelEndpointsData} id="refresh">
                <RefreshIcon />
              </RoundedIcon>
            </div>
          </div>
          <div className="list-view">
            {(artifactsStore.modelEndpoints.loading ||
              applicationsStore.loading ||
              detailsStore.loadingCounter > 0) && <Loader />}
            {artifactsStore.modelEndpoints.loading ||
              applicationsStore.loading ? null : modelEndpoints.length === 0 ? (
                <NoData message={requestErrorMessage || 'No model endpoints found.'} />
              ) : (
              <>
                <div className="list-view__section list-view__section-list">
                  <Form form={formRef.current} onSubmit={() => { }}>
                    {() => (
                      <div className="list-view__section-list__search">
                        <div className="list-view__section-list__search__name-filter">
                          <FormInput
                            inputIcon={<SearchIcon />}
                            name="MEPSearchName"
                            placeholder="Search endpoint..."
                          />
                          <FormOnChange name="MEPSearchName" handler={setSearchNameDebounced} />
                        </div>
                        <div className="list-view__section-list__search_endpoints-counter">{`${filteredEndpoints.length} endpoint${filteredEndpoints.length !== 1 ? 's' : ''} found`}</div>
                      </div>
                    )}
                  </Form>
                  <div className="list-view__section-list__items-wrapper">
                    <div className="list-view__section-list__items" id={LIST_ITEMS_ID}>
                      <ul
                        id={LIST_ID}
                        style={{ paddingTop: virtualizationConfig.tableBodyPaddingTop || 0 }}
                      >
                        {filteredEndpoints.map((modelEndpoint, modelEndpointIndex) => {
                          return (
                            isRowRendered(virtualizationConfig, modelEndpointIndex) && (
                              <li
                                key={modelEndpoint.ui.identifierUnique + modelEndpointIndex}
                                id={modelEndpoint.ui.identifierUnique}
                                className={classNames(
                                  modelEndpoint?.metadata.uid ===
                                  selectedModelEndpoint?.metadata?.uid && 'active'
                                )}
                              >
                                <Link
                                  to={`/projects/${params.projectName}/${MONITORING_APP_PAGE}/${params.appName}/${MODEL_ENDPOINTS_TAB}/${modelEndpoint.metadata.uid}${window.location.search}`}
                                  className="data-ellipsis"
                                >
                                  <Tooltip
                                    template={<TextTooltipTemplate text={modelEndpoint.name} />}
                                  >
                                    {modelEndpoint.name}
                                  </Tooltip>
                                </Link>
                              </li>
                            )
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="list-view__section list-view__section-details">
                  <div className="list-view__section__metrics-content-wrapper">
                    <div className="list-view__section__metrics-content">
                      {!isEmpty(selectedModelEndpoint) && (
                        <DetailsMetrics
                          applicationNameProp={params.appName}
                          selectedItem={selectedModelEndpoint}
                          renderTitle={() => (
                            <Link
                              to={`/projects/${params.projectName}/${MODELS_PAGE}/${MODEL_ENDPOINTS_TAB}/${selectedModelEndpoint.metadata.name}/${selectedModelEndpoint.metadata.uid}/${DETAILS_OVERVIEW_TAB}${window.location.search}`}
                              className="data-ellipsis"
                            >
                              <Tooltip
                                template={<TextTooltipTemplate text={selectedModelEndpoint.name} />}
                              >
                                {selectedModelEndpoint.name}
                              </Tooltip>
                            </Link>
                          )}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationMetrics
