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
import { useDispatch } from 'react-redux'

import { parseFunction } from '../utils/parseFunction'
import { fetchFunctions, fetchFunction } from '../reducers/functionReducer'
import {
  fetchNuclioFunction,
  fetchNuclioFunctions,
  fetchProjectApiGateways
} from '../reducers/nuclioReducer'
import { enrichFunctionsWithNuclio, computeCounters } from '../utils/nuclioEnrichment.util'
import modelEndpointsApi from '../api/modelEndpoints-api'

export { enrichFunctionsWithNuclio, computeCounters }

const DEFAULT_ERROR_MESSAGE = 'Failed to fetch functions'

const resolveNuclioMap = nuclioResult =>
  nuclioResult.status === 'fulfilled' ? (nuclioResult.value ?? {}) : {}

/**
 * @hook useNuclioEnrichedFunctions
 *
 * Dual-fetches MLRun + Nuclio functions, enriches with live state/owner,
 * applies optional client-side filtering, and computes counters.
 *
 * Uses fetchFunctions/fetchFunction from functionReducer internally.
 * If the Nuclio request fails, MLRun data is still returned without Nuclio enrichment.
 *
 * @param {Object}   config
 * @param {string}   config.projectName        - Current project name
 * @param {Object}   [config.filters]          - Current filter state for client-side filtering
 * @param {Function} [config.filterFn]         - (enrichedFunctions, filters) => filteredArray
 * @param {Function} [config.buildFetchConfig] - (filters) => thunkConfig. When provided the hook
 *   auto-fetches on mount using current filters. Must be a stable reference (useCallback with []).
 * @param {string}   [config.errorMessage]     - Custom error message for the list fetch
 */
export const useNuclioEnrichedFunctions = ({
  projectName,
  filters,
  filterFn,
  buildFetchConfig,
  enrichApiGateways = false,
  enrichModelEndpoints = false,
  errorMessage = DEFAULT_ERROR_MESSAGE
}) => {
  const dispatch = useDispatch()
  const nuclioListControllerRef = useRef(null)
  const mlrunListControllerRef = useRef(null)
  const mlrunSingleControllerRef = useRef(null)
  const nuclioSingleControllerRef = useRef(null)
  const gatewaysListControllerRef = useRef(null)
  const modelEndpointsControllerRef = useRef(null)
  const [enrichedFunctions, setEnrichedFunctions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const hasFetchedRef = useRef(null)

  useEffect(() => {
    const controllers = [
      nuclioListControllerRef,
      mlrunListControllerRef,
      mlrunSingleControllerRef,
      nuclioSingleControllerRef,
      gatewaysListControllerRef,
      modelEndpointsControllerRef
    ]
    return () => {
      controllers.forEach(ref => ref.current?.abort())
    }
  }, [])

  const fetchAllNuclioFunctions = useCallback(
    signal =>
      dispatch(
        fetchNuclioFunctions({
          project: projectName,
          signal,
          getOriginalData: true
        })
      ).unwrap(),
    [dispatch, projectName]
  )

  const parseListResponse = useCallback(
    data => (data?.funcs ?? []).map(rawFunc => parseFunction(rawFunc, projectName)),
    [projectName]
  )

  const fetchGatewaysList = useCallback(
    signal => dispatch(fetchProjectApiGateways({ project: projectName, signal })).unwrap(),
    [dispatch, projectName]
  )

  const fetchModelEndpointsList = useCallback(
    signal =>
      modelEndpointsApi
        .getModelEndpoints(projectName, {}, { signal }, { latest_only: 'True' })
        .then(({ data }) => data?.endpoints ?? []),
    [projectName]
  )

  const fetchData = useCallback(
    (thunkConfig = {}) => {
      mlrunListControllerRef.current?.abort()
      mlrunListControllerRef.current = new AbortController()
      nuclioListControllerRef.current?.abort()
      nuclioListControllerRef.current = new AbortController()
      gatewaysListControllerRef.current?.abort()
      gatewaysListControllerRef.current = new AbortController()
      modelEndpointsControllerRef.current?.abort()
      modelEndpointsControllerRef.current = new AbortController()

      const mlrunController = mlrunListControllerRef.current

      setIsLoading(true)

      const config = {
        ...thunkConfig.config,
        ui: {
          ...thunkConfig.config?.ui,
          controller: mlrunController
        }
      }

      const promises = [
        dispatch(fetchFunctions({ project: projectName, errorMessage, ...thunkConfig, config }))
          .unwrap()
          .then(parseListResponse),
        fetchAllNuclioFunctions(nuclioListControllerRef.current.signal)
      ]

      if (enrichApiGateways) {
        promises.push(fetchGatewaysList(gatewaysListControllerRef.current.signal))
      }

      if (enrichModelEndpoints) {
        promises.push(fetchModelEndpointsList(modelEndpointsControllerRef.current.signal))
      }

      return Promise.allSettled(promises)
        .then(results => {
          if (mlrunController.signal.aborted) return

          const [mlrunResult, nuclioResult] = results

          const gatewaysIndex = enrichApiGateways ? 2 : -1
          const modelEndpointsIndex = enrichModelEndpoints ? (enrichApiGateways ? 3 : 2) : -1

          if (mlrunResult.status === 'fulfilled' && mlrunResult.value) {
            const nuclioMap = resolveNuclioMap(nuclioResult)
            const gateways =
              gatewaysIndex >= 0 && results[gatewaysIndex]?.status === 'fulfilled'
                ? (results[gatewaysIndex].value ?? [])
                : []
            const modelEndpoints =
              modelEndpointsIndex >= 0 && results[modelEndpointsIndex]?.status === 'fulfilled'
                ? (results[modelEndpointsIndex].value ?? [])
                : []
            const enriched = enrichFunctionsWithNuclio(
              mlrunResult.value,
              nuclioMap,
              gateways,
              modelEndpoints
            )
            setEnrichedFunctions(enriched)
          }
        })
        .finally(() => {
          if (!mlrunController.signal.aborted) {
            setIsLoading(false)
          }
        })
    },
    [
      dispatch,
      projectName,
      errorMessage,
      parseListResponse,
      fetchAllNuclioFunctions,
      enrichApiGateways,
      fetchGatewaysList,
      enrichModelEndpoints,
      fetchModelEndpointsList
    ]
  )

  useEffect(() => {
    if (buildFetchConfig && hasFetchedRef.current !== projectName) {
      hasFetchedRef.current = projectName
      fetchData(buildFetchConfig(filters))
    }
  }, [fetchData, buildFetchConfig, filters, projectName])

  const { filteredData, counters } = useMemo(() => {
    const filtered = filterFn ? filterFn(enrichedFunctions, filters) : enrichedFunctions
    return { filteredData: filtered, counters: computeCounters(filtered) }
  }, [enrichedFunctions, filters, filterFn])

  const fetchSingleEnrichedFunction = useCallback(
    ({ name, hash, tag, nuclioName }) => {
      mlrunSingleControllerRef.current?.abort()
      mlrunSingleControllerRef.current = new AbortController()
      nuclioSingleControllerRef.current?.abort()
      nuclioSingleControllerRef.current = new AbortController()
      gatewaysListControllerRef.current?.abort()
      gatewaysListControllerRef.current = new AbortController()

      const mlrunController = mlrunSingleControllerRef.current
      const resolvedNuclioName = nuclioName || `${projectName}-${name}`

      const promises = [
        dispatch(
          fetchFunction({
            project: projectName,
            name,
            hash,
            tag,
            signal: mlrunController.signal
          })
        )
          .unwrap()
          .then(rawFunc => (rawFunc ? parseFunction(rawFunc, projectName) : null)),
        dispatch(
          fetchNuclioFunction({
            project: projectName,
            name: resolvedNuclioName,
            signal: nuclioSingleControllerRef.current.signal
          })
        ).unwrap()
      ]

      if (enrichApiGateways) {
        promises.push(fetchGatewaysList(gatewaysListControllerRef.current.signal))
      }

      return Promise.allSettled(promises).then(([mlrunResult, nuclioResult, gatewaysResult]) => {
        if (mlrunController.signal.aborted) return null
        if (mlrunResult.status !== 'fulfilled' || !mlrunResult.value) return null

        const parsed = mlrunResult.value
        const nuclioFuncData =
          nuclioResult.status === 'fulfilled' && nuclioResult.value ? nuclioResult.value : null
        const nuclioMap = nuclioFuncData ? { [resolvedNuclioName]: nuclioFuncData } : {}
        const gateways = gatewaysResult?.status === 'fulfilled' ? (gatewaysResult.value ?? []) : []
        const [enriched] = enrichFunctionsWithNuclio([parsed], nuclioMap, gateways)

        return enriched
      })
    },
    [dispatch, projectName, enrichApiGateways, fetchGatewaysList]
  )

  return {
    fetchData,
    fetchSingleEnrichedFunction,
    enrichedFunctions,
    filteredData,
    counters,
    isLoading
  }
}
