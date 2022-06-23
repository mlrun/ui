import {
  FUNCTIONS_READY_STATES,
  TRANSIENT_FUNCTION_STATUSES
} from '../components/FunctionsPage/functions.util'
import { TAG_LATEST } from '../constants'

export const getFunctionLogs = (
  fetchFunctionLogs,
  fetchFunctionLogsTimeout,
  projectName,
  name,
  tag,
  offset,
  navigate,
  refreshFunctions,
  startedDeploying
) => {
  fetchFunctionLogs(projectName, name, tag, offset).then(result => {
    if (
      TRANSIENT_FUNCTION_STATUSES.includes(
        result.headers?.['x-mlrun-function-status']
      )
    ) {
      fetchFunctionLogsTimeout.current = setTimeout(() => {
        let currentOffset = offset
          ? offset + result.data.length
          : result.data.length

        getFunctionLogs(
          fetchFunctionLogs,
          fetchFunctionLogsTimeout,
          projectName,
          name,
          tag,
          currentOffset,
          navigate,
          refreshFunctions,
          true
        )
      }, 2000)
    } else {
      if (
        FUNCTIONS_READY_STATES.includes(
          result.headers?.['x-mlrun-function-status']
        ) &&
        startedDeploying
      ) {
        refreshFunctions().then(response => {
          const hash = response.find(
            item => item.name === name && item.tag === TAG_LATEST
          ).hash

          if (hash) {
            navigate(`/projects/${projectName}/functions/${hash}/build-log`)
          }
        })
      }

      clearTimeout(fetchFunctionLogsTimeout.current)
    }
  })
}
