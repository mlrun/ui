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
import { REQUEST_CANCELED } from '..//constants'
import { fetchJobLogs } from '../reducers/jobReducer'

export const getJobLogs = (id, project, streamLogsRef, setDetailsLogs, dispatch, attempt, signal) => {
  setDetailsLogs('')

  dispatch(fetchJobLogs({ id, project, attempt, signal }))
    .unwrap()
    .then(res => {
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
    }).catch((error) => {
      if (error.message === REQUEST_CANCELED) {
        setDetailsLogs('')
      }
    })
}
