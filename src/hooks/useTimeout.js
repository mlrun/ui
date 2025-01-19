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

import { useCallback, useEffect, useRef } from 'react'

/**
 * Set a timer, which executes a function once the timer expires. Exposes pause, resume and cancel
 * callbacks to the consumers.
 *
 * @param fn Callback function to execute after the specified timeout
 * @param ms Timeout in milliseconds after which to execute the callback
 */
export const useTimeout = (fn, ms) => {
  // Indicates if timer is currently running
  const isRunning = useRef(false)

  // Number of milliseconds remaining before the timer runs out and callback is executed
  const msRemaining = useRef(ms)

  // Time when the most recent execution was requested (0 if time is not currently running)
  const timeStarted = useRef(0)

  // Timeout handle
  const handle = useRef(0)

  // Original callback function
  const callback = useRef(fn)

  /**
   * Completely cancel the execution of the callback function
   */
  const cancelTimeout = useCallback(() => {
    // Ignore request if there is no active timeout to cancel
    if (handle.current <= 0) {
      return
    }

    // Mark timer as paused and reset all internal values to avoid being able to restart it
    isRunning.current = false
    msRemaining.current = 0
    timeStarted.current = 0

    clearTimeout(handle.current)
    handle.current = 0
  }, [])

  /**
   * Resume timeout countdown
   */
  const resumeTimeout = useCallback(() => {
    // Ignore request if time is already running or if there is no time remaining
    if (isRunning.current || msRemaining.current <= 0) {
      return
    }

    // Mark timer as running and record the current time for future calculations
    isRunning.current = true
    timeStarted.current = Date.now()

    // Schedule timeout
    handle.current = setTimeout(() => {
      // Clear all internal values when the timer executes
      cancelTimeout()

      // Invoke the callback function
      callback.current && callback.current()
    }, msRemaining.current)
  }, [cancelTimeout])

  /**
   * Pause current countdown
   */
  const pauseTimeout = useCallback(() => {
    // Ignore request if timer is not currently running
    if (!isRunning.current) {
      return
    }

    // Mark timer as paused, clear last time started and reduce the number of remaining
    // milliseconds by the time that passed since the last "start" call
    isRunning.current = false
    msRemaining.current -= Date.now() - timeStarted.current
    timeStarted.current = 0

    // Clear timeout handle to avoid the function executing while timer is paused
    clearTimeout(handle.current)
    handle.current = 0
  }, [])

  // Update callback function reference when a new function is passed in
  useEffect(() => {
    callback.current = fn
  }, [fn])

  // Start the timer on mount and cancel it on unmount
  useEffect(() => {
    resumeTimeout()
    return cancelTimeout
  }, [cancelTimeout, resumeTimeout])

  return {
    cancelTimeout,
    pauseTimeout,
    resumeTimeout
  }
}
