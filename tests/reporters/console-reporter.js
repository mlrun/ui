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
// Playwright reporter of the E2E regression console output (console-renderer.js).
// E2E_REPORTER_EVENTS=true - print the events as JSON lines instead, scripts/testRegression.js renders the events of
// the parallel shards together
import { stripVTControlCharacters } from 'node:util'

import { ConsoleRenderer, EVENT_PREFIX } from './console-renderer.js'

const GHERKIN_STEP = /^(Given|When|Then|And|But|\*) /

// the Gherkin step that failed (it can fail in a nested step of an action)
const findFailedStep = steps => {
  for (const step of steps) {
    if (!step.error) continue

    const nestedStep = findFailedStep(step.steps)

    if (nestedStep) return nestedStep
    if (GHERKIN_STEP.test(step.title) || step.category === 'hook') return step.title
  }
}

const getKind = (test, result) => {
  if (result.status === 'interrupted') return 'interrupted'
  if (
    result.status !== test.expectedStatus &&
    result.status !== 'skipped' &&
    result.retry < test.retries
  ) {
    return 'retrying'
  }

  const outcome = test.outcome()

  if (outcome === 'skipped' || outcome === 'flaky') return outcome
  if (outcome === 'expected') return test.expectedStatus === 'failed' ? 'known' : 'passed'

  return test.expectedStatus === 'failed' && result.status === 'passed' ? 'knownFixed' : 'failed'
}

export default class ConsoleReporter {
  constructor() {
    if (process.env.E2E_REPORTER_EVENTS === 'true') {
      this.send = event => process.stdout.write(`${EVENT_PREFIX}${JSON.stringify(event)}\n`)
    } else {
      this.renderer = new ConsoleRenderer()
      this.send = event => this.renderer.handle(event)
    }
  }

  printsToStdio() {
    return true
  }

  onBegin(config, suite) {
    this.send({
      type: 'begin',
      total: suite.allTests().length,
      retries: config.projects[0]?.retries ?? 0,
      workers: config.workers,
      tags: process.env.E2E_TAGS,
      headless: config.projects[0]?.use?.headless ?? true
    })
  }

  onTestBegin(test) {
    this.send({ type: 'testBegin', id: test.id, name: test.title })
  }

  onTestEnd(test, result) {
    const error = result.error?.message ?? result.error?.value

    const kind = getKind(test, result)

    this.send({
      type: 'testEnd',
      id: test.id,
      kind,
      // an unexpected pass is retried as well
      note:
        kind === 'retrying' && result.status === 'passed'
          ? 'known bug passed, retrying'
          : undefined,
      feature: test.parent.title,
      name: test.title,
      retry: result.retry,
      duration: result.duration,
      step: findFailedStep(result.steps),
      error: error && stripVTControlCharacters(error).replace(/^Error: /, '')
    })
  }

  onError(error) {
    this.send({
      type: 'error',
      message: stripVTControlCharacters(error.message ?? String(error.value))
    })
  }

  onEnd() {
    this.renderer?.printSummary()
  }
}
