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
// Allure results of the E2E regression (written by allure-playwright, playwright.config.js)

// scenarios that are expected to fail (`test.fail()` in tests/features/support/hooks.js), a pass is accepted too
const KNOWN_FAILURE_TAGS = ['knownBug', 'FAILED_TODO']
export const KNOWN_FAILURE_FIXED_MESSAGE =
  'Known bug passed: if it keeps passing, the bug is fixed, remove the @knownBug/@FAILED_TODO tag'

const getTags = result =>
  result.labels.filter(label => label.name === 'tag').map(label => label.value.replace(/^@/, ''))

const isKnownFailure = result => getTags(result).some(tag => KNOWN_FAILURE_TAGS.includes(tag))

// a retried check (`expect.poll`, `retryAssertion`) records its failed attempts as failed steps, a step that passed in
// the end looked broken in the report ("Values of "name" column" failed 3 times inside a passed step). The attempts of a
// passed step are dropped, a failed step keeps all of them
const dropFailedAttemptsOfPassedSteps = steps =>
  (steps ?? []).map(step => ({
    ...step,
    steps:
      step.status === 'passed'
        ? dropFailedAttempts(step.steps)
        : dropFailedAttemptsOfPassedSteps(step.steps)
  }))

const dropFailedAttempts = steps =>
  (steps ?? [])
    .filter(step => !['failed', 'broken'].includes(step.status))
    .map(step => ({ ...step, steps: dropFailedAttempts(step.steps) }))

// allure-playwright reports the result of a test relative to its expected status, the report shows the actual one
export const allureResultsListener = {
  beforeTestResultWrite(result) {
    result.steps = dropFailedAttemptsOfPassedSteps(result.steps)

    const hasError = Boolean(result.statusDetails?.message)

    if (isKnownFailure(result)) {
      if (result.status === 'passed' && hasError) {
        // "known": the failure is shown as accepted, it isn't counted in the failures statistics
        result.status = 'failed'
        result.statusDetails = { ...result.statusDetails, known: true }
      } else if (result.status === 'passed') {
        result.statusDetails = { ...result.statusDetails, message: KNOWN_FAILURE_FIXED_MESSAGE }
      }
    }

    // a test is retried only after a failure
    const isRetry = result.parameters.some(parameter => parameter.name === 'Retry')

    if (isRetry && result.status === 'passed') {
      result.statusDetails = { ...result.statusDetails, flaky: true }
    }

    // the suites are "chromium" > the generated spec file > the feature, the feature is enough
    const feature = result.labels.find(label => label.name === 'subSuite')?.value

    if (feature) {
      result.labels = [
        ...result.labels.filter(
          label => !['parentSuite', 'suite', 'subSuite'].includes(label.name)
        ),
        { name: 'suite', value: feature },
        { name: 'feature', value: feature }
      ]
    }
  }
}
