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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash-es'
import { HelpCircle, FileCode2 } from 'lucide-react'
import {
  DataTable,
  Loader,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from 'igz-controls/nextGenComponents'

import ApplicationCounters from './ApplicationCounters/ApplicationCounters'
import ApplicationDetails from './ApplicationDetails/ApplicationDetails'
import ApplicationsFilters from './ApplicationsFilters/ApplicationsFilters'
import ActionBar from '../../shared/ActionBar/ActionBar'
import Breadcrumbs from '../../../common/Breadcrumbs/Breadcrumbs'
import NoData from '../../shared/NoData/NoData'
import YamlModal from '../../shared/YamlModal/YamlModal'

import { showErrorNotification } from 'igz-controls/utils/notification.util'
import { useFiltersFromSearchParams } from '../../../hooks/useFiltersFromSearchParams.hook'
import { useNuclioEnrichedFunctions } from '../../../hooks/useNuclioEnrichedFunctions.hook'
import { getApplicationsColumns } from './applicationsColumns'
import { checkForSelectedApplication } from './applicationsPage.util'
import { getNoDataMessage } from '../../../utils/getNoDataMessage'
import {
  APPLICATION_KIND,
  APPLICATIONS_ERROR_MESSAGE,
  APPLICATIONS_FILTERS_CONFIG,
  DEFAULT_UPDATED_SORTING,
  TAG_WILDCARD
} from './applications.constants'
import {
  buildApiFilters,
  filterApplications,
  parseApplicationsQueryParams
} from './applicationsPage.util'
import { APPLICATIONS_PAGE, APPLICATIONS_PAGE_PATH } from '../../../constants'
import {
  DEFAULT_APPLICATION_DETAILS_TAB,
  VIEW_YAML_LABEL
} from './ApplicationDetails/applicationDetails.constants'

const ApplicationsPage = () => {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const funcLoading = useSelector(
    store => store.functionsStore.funcLoading || store.nuclioStore.nuclioFunctionLoading
  )
  const lastCheckedApplicationIdRef = useRef(null)
  const [selectedApplication, setSelectedApplication] = useState({})
  const [detailsRefreshKey, setDetailsRefreshKey] = useState(() => Date.now())
  const [yamlData, setYamlData] = useState(null)

  const isDetailsOpen = !isEmpty(selectedApplication)

  const filters = useFiltersFromSearchParams(
    APPLICATIONS_FILTERS_CONFIG,
    parseApplicationsQueryParams
  )

  const buildFetchConfig = useCallback(currentFilters => {
    const apiFilters = buildApiFilters(currentFilters)
    return {
      filters: {},
      config: { params: { ...apiFilters, kind: APPLICATION_KIND, tag: TAG_WILDCARD } }
    }
  }, [])

  const {
    fetchData,
    fetchSingleEnrichedFunction,
    filteredData: applications,
    counters,
    isLoading
  } = useNuclioEnrichedFunctions({
    projectName: params.projectName,
    filters,
    filterFn: filterApplications,
    buildFetchConfig,
    enrichApiGateways: true,
    enrichModelEndpoints: true,
    errorMessage: APPLICATIONS_ERROR_MESSAGE
  })

  const handleRefresh = useCallback(
    currentFilters => fetchData(buildFetchConfig(currentFilters)),
    [fetchData, buildFetchConfig]
  )

  const handleCloseDetails = useCallback(() => {
    setSelectedApplication({})
    navigate(`/projects/${params.projectName}/${APPLICATIONS_PAGE_PATH}${window.location.search}`, {
      replace: true
    })
  }, [navigate, params.projectName])

  const handleTabChange = useCallback(
    tabId => {
      if (params.name && params.id) {
        navigate(
          `/projects/${params.projectName}/${APPLICATIONS_PAGE_PATH}/${params.name}/${params.id}/${tabId}${window.location.search}`,
          { replace: true }
        )
      }
    },
    [navigate, params.projectName, params.name, params.id]
  )

  const selectionArgs = useMemo(
    () => ({
      applicationName: params.name,
      applicationId: params.id,
      applications,
      navigate,
      projectName: params.projectName,
      setSelectedApplication,
      fetchSingleEnrichedFunction,
      dispatch,
      lastCheckedApplicationIdRef
    }),
    [
      applications,
      dispatch,
      fetchSingleEnrichedFunction,
      navigate,
      params.id,
      params.name,
      params.projectName
    ]
  )

  const handleRefreshDetails = useCallback(() => {
    fetchSingleEnrichedFunction({
      name: selectedApplication.name,
      hash: selectedApplication.hash,
      tag: selectedApplication.tag,
      nuclioName: selectedApplication.nuclio_name
    })
      .then(enriched => {
        if (enriched) {
          setSelectedApplication(enriched)
          setDetailsRefreshKey(Date.now())
        } else {
          setSelectedApplication({})
        }
      })
      .catch(error => {
        setSelectedApplication({})
        showErrorNotification(dispatch, error, '', 'Failed to retrieve application data')
      })
  }, [dispatch, fetchSingleEnrichedFunction, selectedApplication])

  const handleViewYaml = useCallback(application => {
    setYamlData(application.ui?.originalContent ?? application)
  }, [])

  const handleCloseYaml = useCallback(() => setYamlData(null), [])

  const rowActions = useCallback(
    application => [
      {
        label: VIEW_YAML_LABEL,
        icon: FileCode2,
        onClick: () => handleViewYaml(application)
      }
    ],
    [handleViewYaml]
  )

  useEffect(() => {
    checkForSelectedApplication(selectionArgs)

    return () => checkForSelectedApplication.cancel?.()
  }, [selectionArgs])

  useEffect(() => {
    if (isEmpty(selectedApplication)) {
      lastCheckedApplicationIdRef.current = null
    }
  }, [selectedApplication])

  const columns = useMemo(() => getApplicationsColumns(params.projectName), [params.projectName])

  return (
    <div
      className="h-screen overflow-hidden bg-background flex flex-col w-full"
      data-testid="applications-page"
    >
      <TooltipProvider>
        <div className="px-6 py-4 flex items-center justify-between shrink-0">
          <Breadcrumbs />
        </div>

        <div className="flex flex-col flex-1 overflow-hidden relative">
          <div className="px-6 shrink-0">
            <ActionBar
              filtersConfig={APPLICATIONS_FILTERS_CONFIG}
              filters={filters}
              onRefresh={handleRefresh}
            >
              {({ filters: activeFilters, applyFilter, applyMultipleFilters }) => (
                <ApplicationsFilters
                  filters={activeFilters}
                  applyFilter={applyFilter}
                  applyMultipleFilters={applyMultipleFilters}
                />
              )}
            </ActionBar>
          </div>

          <div className="flex flex-col flex-1 overflow-hidden px-6 pb-6 pt-0">
            <ApplicationCounters counters={counters} isLoading={isLoading} />
            <div
              className="flex flex-col flex-1 overflow-hidden mt-4 p-[20px] text-igz-secondary bg-background border rounded-lg shadow-card"
              data-testid="applications-list"
            >
              <div className="flex items-center gap-1.5 mb-3 shrink-0">
                <h2
                  className="text-base font-medium text-igz-primary"
                  data-testid="applications-heading"
                >
                  All Applications
                </h2>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <span
                      className="inline-flex cursor-default"
                      aria-label="About the applications list"
                      data-testid="applications-heading-hint"
                    >
                      <HelpCircle
                        className="h-4 w-4 text-igz-gray"
                        aria-hidden="true"
                        data-testid="help-icon"
                      />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    List of all deployed applications in the project
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex-1 min-h-[200px] flex flex-col [&_thead_tr]:z-[1]">
                {isLoading ? (
                  <Loader mode="fullscreen" />
                ) : applications.length === 0 && !isDetailsOpen ? (
                  <NoData
                    message={getNoDataMessage(
                      filters,
                      APPLICATIONS_FILTERS_CONFIG,
                      null,
                      APPLICATIONS_PAGE
                    )}
                  />
                ) : (
                  <DataTable
                    data={applications}
                    columns={columns}
                    rowActions={rowActions}
                    initialSorting={DEFAULT_UPDATED_SORTING}
                  />
                )}
              </div>
            </div>
          </div>

          {isDetailsOpen && (
            <div
              className="absolute inset-0 z-10 bg-background"
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedApplication.name} details`}
            >
              <ApplicationDetails
                key={detailsRefreshKey}
                application={selectedApplication}
                activeTab={params.tab ?? DEFAULT_APPLICATION_DETAILS_TAB}
                onTabChange={handleTabChange}
                onClose={handleCloseDetails}
                onRefresh={handleRefreshDetails}
              />
            </div>
          )}
          {funcLoading && <Loader mode="fullscreen" />}
        </div>
      </TooltipProvider>
      <YamlModal open={!!yamlData} data={yamlData} onClose={handleCloseYaml} />
    </div>
  )
}

export default ApplicationsPage
