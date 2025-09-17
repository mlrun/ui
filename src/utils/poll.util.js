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
import { constant, chain, isNil, overSome, isNaN, isFinite } from 'lodash'

import { FAILED_STATE, RUNNING_STATE, SUCCEEDED_STATE } from '../constants'

export const BG_TASK_RUNNING = RUNNING_STATE
export const BG_TASK_FAILED = FAILED_STATE
export const BG_TASK_SUCCEEDED = SUCCEEDED_STATE

/**
 * Polls by calling `pollMethod` and then invoking `isDone` method with `pollMethod`'s result. Stops polling
 * when `isDone` returned `true`. Keeps on polling as long as `isDone` returns `false`.
 * @param {function} pollMethod - the method to invoke for a single polling cycle.
 * @param {function} isDone - the method to invoke with the result of `pollMethod` (in case it is successful).
 *     It should return `true` to indicate the polling should stop or `false` to indicate the polling should
 *     continue.
 * @param {Object} [options] - various options for configuring the polling process.
 * @param {number} [options.delay=2000] - the delay in milli-seconds between polling cycles.
 * @param {function} [options.isDoneFail] - will be invoked with the error of `pollMethod` in case it failed.
 *     If it returns `true` then the polling stops.
 * @param {number} [options.maxRetries=10] - the maximum number of failed polling cycles. When it is exceeded
 *     then a rejected promise is returned with an error message. Note: this parameter is relevant to _failed_
 *     polling cycles. Successful polling cycles could go on forever.
 * @param {number} [options.timeoutMillis] - If provided, polling will time out after this number of
 *     milliseconds.
 * @param {Promise} [options.terminatePollRef] - if provided, the request is cancelled on resolving this promise.
 * @returns {Promise} a promise that is resolved with the result of last polling cycle (when polling is done),
 *     or rejected with an error in case the request for polling failed at least `maxRetries` times or polling
 *     was aborted by resolving `options.timeoutPromise`, or polling timed out after `options.timeoutMillis`
 *     milliseconds.
 */
export const pollTask = (pollMethod, isDone, options) => {
  let iterationTimeout = null
  let overallTimeout = null
  let terminated = false

  const config = chain(options)
    .clone()
    .omitBy(overSome(isNil, isNaN)) // omit undefined, null and NaN values
    .defaults({
      delay: 2000,
      maxRetries: 10,
      timeoutMillis: NaN,
      isDoneFail: constant(false),
      terminatePollRef: null
    })
    .value()

  const pollingAbortedError = new Error('polling aborted')
  const pollingTimedOutError = new Error('polling timed out')
  const maxRetriesExceededError = new Error('Max retries exceeded (' + config.maxRetries + ')')

  if (isFinite(config.timeoutMillis) && config.timeoutMillis > 0) {
    overallTimeout = setTimeout(() => terminatePolling(pollingTimedOutError), config.timeoutMillis)
  }

  if (config.terminatePollRef) {
    config.terminatePollRef.current = () => terminatePolling(pollingAbortedError)
  }

  return pollOnce()

  /**
   * Terminates polling process and rejects the returned promise with an appropriate error.
   * Cancels all pending intervals set by this method.
   * @param {Error} error - used as the rejection reason of the returned promise.
   */
  function terminatePolling(error) {
    terminated = true

    if (iterationTimeout !== null) {
      clearTimeout(iterationTimeout)
      iterationTimeout = null
    }
    if (overallTimeout !== null) {
      clearTimeout(overallTimeout)
      overallTimeout = null
    }

    return error
  }

  /**
   * Polls by calling `pollMethod` and then invoking `isDone` method with `pollMethod`'s result.
   * Stops polling in case `isDone` returns `true`.
   * Schedules next poll in case `isDone` returns `false`.
   */
  function pollOnce() {
    return pollMethod()
      .then(result => (isDone(result) ? result : pollAgain()))
      .catch(error => {
        if (config.isDoneFail(error)) {
          return error
        } else {
          config.maxRetries -= 1

          if (config.maxRetries > 0) {
            return pollAgain()
          } else {
            throw maxRetriesExceededError
          }
        }
      })
  }

  /**
   * Schedules next poll cycle after `delay` milliseconds.
   */
  function pollAgain() {
    return new Promise(resolve => {
      if (!terminated) {
        iterationTimeout = setTimeout(() => {
          iterationTimeout = null

          resolve(pollOnce())
        }, config.delay)
      }
    })
  }
}

export const isBackgroundTaskRunning = response => {
  return (
    response.data?.kind === 'BackgroundTask' &&
    response.data?.metadata?.name &&
    response.data.status.state === BG_TASK_RUNNING
  )
}
