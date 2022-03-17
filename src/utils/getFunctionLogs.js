import {
  FUNCTIONS_READY_STATES,
  TRANSIENT_FUNCTION_STATUSES
} from '../components/FunctionsPage/functions.util'

export const getFunctionLogs = (
  fetchFunctionLogs,
  fetchFunctionLogsTimeout,
  projectName,
  name,
  tag,
  offset,
  history,
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
          history,
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
          const uid = response.find(
            item => item.name === name && item.tag === 'latest'
          ).hash

          if (uid) {
            history.push(`/projects/${projectName}/functions/${uid}/build-log`)
          }
        })
      }

      clearTimeout(fetchFunctionLogsTimeout.current)
    }
  })
}
