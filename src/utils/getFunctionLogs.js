import { TRANSIENT_FUNCTION_STATUSES } from '../components/FunctionsPage/functions.util'

export const getFunctionLogs = (
  fetchFunctionLogs,
  fetchFunctionLogsTimeout,
  projectName,
  name,
  tag,
  offset
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

        getFunctionLogs(projectName, name, tag, currentOffset)
      }, 2000)
    } else {
      clearTimeout(fetchFunctionLogsTimeout.current)
    }
  })
}
