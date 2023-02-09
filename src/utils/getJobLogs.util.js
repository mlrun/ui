export const getJobLogs = (uid, projectName, fetchJobLogs, streamLogsRef, setDetailsLogs) => {
  fetchJobLogs(uid, projectName).then(res => {
    const reader = res.body?.getReader()

    if (reader) {
      const decoder = new TextDecoder()
      const read = () => {
        reader.read().then(({ done, value }) => {
          if (done) {
            return
          }

          setDetailsLogs(prevState => prevState + decoder.decode(value))
        })
      }

      streamLogsRef.current = read
      read()
    }
  })
}