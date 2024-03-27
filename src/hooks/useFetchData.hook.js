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
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { REQUEST_CANCELED } from '../constants'

export const useFetchData = ({ action, filter, skipFetching = false }) => {
  const [loadingState, setLoadingState] = useState(true)
  const dispatch = useDispatch()
  const abortRef = useRef()

  useEffect(() => {
    return () => {
      if (abortRef.current && !skipFetching) {
        abortRef.current.abort(REQUEST_CANCELED)
      }
    }
  }, [skipFetching])

  useEffect(() => {
    if (!skipFetching) {
      setLoadingState(true)
      abortRef.current = new AbortController()

      dispatch(
        action('*', filter, {
          signal: abortRef.current.signal
        })
      ).then(data => {
        if (data) {
          setLoadingState(false)
        }
      })
    }
  }, [dispatch, filter, action, skipFetching])

  return { loading: !skipFetching && loadingState }
}
