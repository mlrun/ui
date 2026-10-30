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
'use strict'

// prints one line per finished scenario: [done/total] status location name (duration) | failed count, ETA
// failed scenarios also print the failed step and the first lines of its error right away
import { Formatter, Status, formatterHelpers } from '@cucumber/cucumber'

const useColors = !process.env.NO_COLOR
const paint = code => text => (useColors ? `\x1b[${code}m${text}\x1b[0m` : text)
const green = paint(32)
const red = paint(31)
const yellow = paint(33)
const gray = paint(90)
const bold = paint(1)

const ERROR_LINES = 4

const toMs = ({ seconds, nanos }) => seconds * 1000 + nanos / 1e6

const formatDuration = ms => {
  const totalSeconds = Math.round(ms / 1000)

  if (totalSeconds < 60) return `${(ms / 1000).toFixed(1)}s`

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return hours ? `${hours}h${String(minutes).padStart(2, '0')}m` : `${minutes}m${String(seconds).padStart(2, '0')}s`
}

const STATUS_LABELS = {
  [Status.PASSED]: green('✔ PASS'),
  [Status.FAILED]: red('✖ FAIL'),
  [Status.SKIPPED]: yellow('- SKIP'),
  [Status.PENDING]: yellow('? PEND'),
  [Status.UNDEFINED]: yellow('? UNDEF'),
  [Status.AMBIGUOUS]: red('✖ AMBIG')
}

class ScenarioFormatter extends Formatter {
  constructor(options) {
    super(options)

    this.total = 0
    this.done = 0
    this.failed = 0
    this.passed = 0
    this.runStartedAt = null
    this.startedAt = {}

    options.eventBroadcaster.on('envelope', envelope => {
      if (envelope.testCase) this.total++
      if (envelope.testRunStarted) this.runStartedAt = toMs(envelope.testRunStarted.timestamp)
      if (envelope.testCaseStarted) {
        this.startedAt[envelope.testCaseStarted.id] = toMs(envelope.testCaseStarted.timestamp)
      }
      if (envelope.testCaseFinished) this.onTestCaseFinished(envelope.testCaseFinished)
      if (envelope.testRunFinished) this.onTestRunFinished(envelope.testRunFinished)
    })
  }

  onTestCaseFinished({ testCaseStartedId, timestamp, willBeRetried }) {
    const attempt = this.eventDataCollector.getTestCaseAttempt(testCaseStartedId)
    const { gherkinDocument, pickle, testCase, stepResults, worstTestStepResult } = attempt
    const status = worstTestStepResult.status
    const finishedAt = toMs(timestamp)
    const duration = finishedAt - this.startedAt[testCaseStartedId]

    if (willBeRetried) {
      this.log(`${yellow('↻ RETRY')} ${pickle.name}\n`)

      return
    }

    const isFailure = formatterHelpers.isFailure(worstTestStepResult)

    this.done++
    if (isFailure) this.failed++
    if (status === Status.PASSED) this.passed++

    const { line } = formatterHelpers.PickleParser.getPickleLocation({ gherkinDocument, pickle })
    const counter = `[${String(this.done).padStart(String(this.total).length)}/${this.total}]`
    const average = (finishedAt - this.runStartedAt) / this.done
    const eta = formatDuration(average * (this.total - this.done))
    const failedInfo = this.failed ? red(`${this.failed} failed`) : green('0 failed')

    this.log(
      `${gray(counter)} ${STATUS_LABELS[status] || status} ${gray(`${pickle.uri}:${line}`)} ` +
        `${status === Status.PASSED ? pickle.name : bold(pickle.name)} ${gray(`(${formatDuration(duration)})`)}` +
        ` ${gray('|')} ${failedInfo}${gray(`, ETA ${eta}`)}\n`
    )

    if (!isFailure) return

    const pickleSteps = formatterHelpers.PickleParser.getPickleStepMap(pickle)
    const failedStep = testCase.testSteps.find(step => stepResults[step.id].status === status)

    if (!failedStep) return

    const result = stepResults[failedStep.id]
    const stepText = failedStep.pickleStepId
      ? `${pickleSteps[failedStep.pickleStepId].text}`
      : 'hook'
    const stepDefinition = failedStep.stepDefinitionIds?.length
      ? this.supportCodeLibrary.stepDefinitions.find(({ id }) => id === failedStep.stepDefinitionIds[0])
      : this.supportCodeLibrary.beforeTestCaseHookDefinitions
          .concat(this.supportCodeLibrary.afterTestCaseHookDefinitions)
          .find(({ id }) => id === failedStep.hookId)
    const stepLocation = stepDefinition ? gray(` (${stepDefinition.uri}:${stepDefinition.line})`) : ''
    const message = (result.exception?.message || result.message || status)
      .split('\n')
      .filter(errorLine => errorLine.trim() && !errorLine.trim().startsWith('at '))
      .slice(0, ERROR_LINES)
      .map(errorLine => `           ${errorLine}`)
      .join('\n')

    this.log(`         ${red('step:')} ${stepText}${stepLocation}\n${red(message)}\n`)
  }

  onTestRunFinished() {
    const elapsed = this.runStartedAt ? formatDuration(Date.now() - this.runStartedAt) : ''

    const otherCount = this.done - this.passed - this.failed
    const otherInfo = otherCount ? `, ${yellow(`${otherCount} skipped/pending`)}` : ''

    this.log(
      `\n${bold(`${this.done} scenarios`)}: ${green(`${this.passed} passed`)}, ` +
        `${this.failed ? red(`${this.failed} failed`) : '0 failed'}${otherInfo} ${gray(`in ${elapsed}`)}\n`
    )
  }
}

export default ScenarioFormatter
