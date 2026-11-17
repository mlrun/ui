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
// Playwright reporter of the E2E regression console output: a line per scenario (with the worker that ran it when
// there are several), the failure details, a live progress bar (in a terminal) and the summary. The workers run their
// scenarios at the same time, so everything is keyed by the worker slot (`parallelIndex`), not by the order of events
import { stripVTControlCharacters, styleText } from 'node:util'

const out = process.stdout
const isTTY = Boolean(out.isTTY)
const paint = (format, text) => styleText(format, text, { stream: out })

const KINDS = {
  passed: { icon: '✓', color: 'green', label: 'passed' },
  failed: { icon: '✘', color: 'red', label: 'failed' },
  known: { icon: '◆', color: 'magenta', label: 'known bug, failed as expected' },
  knownFixed: {
    icon: '★',
    color: 'red',
    label: 'known bug passed: remove the @knownBug/@FAILED_TODO tag'
  },
  flaky: { icon: '⚠', color: 'yellow', label: 'flaky, passed on a retry' },
  retrying: { icon: '↻', color: 'yellow', label: 'failed, retrying' },
  skipped: { icon: '○', color: 'gray', label: 'skipped' },
  interrupted: { icon: '■', color: 'gray', label: 'interrupted' }
}
const SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
const BAR_WIDTH = 24
const GHERKIN_STEP = /^(Given|When|Then|And|But|\*) /

const formatDuration = ms => {
  const seconds = Math.round(ms / 1000)

  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  if (seconds < 3600)
    return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, '0')}s`

  return `${Math.floor(seconds / 3600)}h ${String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')}m`
}

const visibleLength = text => stripVTControlCharacters(text).length
const truncate = (text, width) => (text.length > width ? `${text.slice(0, width - 1)}…` : text)

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
    this.total = 0
    this.done = 0
    this.workers = 1
    this.repeatEach = 1
    this.counts = Object.fromEntries(Object.keys(KINDS).map(kind => [kind, 0]))
    this.finished = { failed: [], flaky: [], known: [], knownFixed: [] }
    // by the worker slot: a slot runs one scenario at a time, and with `--repeat-each` the same scenario can run in
    // several slots at once
    this.running = new Map()
    this.durations = 0
    this.errors = []
    this.startTime = Date.now()
    this.frame = 0
    this.barShown = false
    this.headerPrinted = false
    this.timer = null
  }

  printsToStdio() {
    return true
  }

  onBegin(config, suite) {
    const project = config.projects[0]

    this.total = suite.allTests().length
    this.workers = config.workers
    this.repeatEach = project?.repeatEach ?? 1
    this.printHeader({
      retries: project?.retries ?? 0,
      tags: process.env.E2E_TAGS,
      headless: project?.use?.headless ?? true
    })
  }

  printHeader({ retries, tags, headless }) {
    this.headerPrinted = true

    const scenarios =
      this.repeatEach > 1
        ? `${this.total / this.repeatEach} scenarios × ${this.repeatEach}`
        : `${this.total} scenario${this.total === 1 ? '' : 's'}`
    const details = [
      scenarios,
      `${this.workers} worker${this.workers === 1 ? '' : 's'}`,
      `retries: ${retries}`,
      `tags: ${tags || 'all'}`,
      headless ? 'headless' : 'headed'
    ]

    this.print(
      `\n${paint('bold', '  MLRun UI E2E regression')}  ${paint('gray', details.join(' · '))}\n`
    )

    if (isTTY) {
      out.write('\x1b[?25l')
      process.on('exit', () => out.write('\x1b[?25h'))
      this.timer = setInterval(() => this.drawBar(), 1000)
      this.timer.unref()
    }
  }

  onTestBegin(test, result) {
    this.running.set(result.parallelIndex, { name: test.title, start: Date.now() })
    this.drawBar()
  }

  onTestEnd(test, result) {
    const error = result.error?.message ?? result.error?.value
    const kind = getKind(test, result)

    this.running.delete(result.parallelIndex)
    this.testEnd({
      kind,
      // an unexpected pass is retried as well
      note:
        kind === 'retrying' && result.status === 'passed'
          ? 'known bug passed, retrying'
          : undefined,
      feature: test.parent.title,
      name: test.title,
      repeat: this.repeatEach > 1 ? test.repeatEachIndex + 1 : 0,
      worker: this.workers > 1 ? result.parallelIndex + 1 : 0,
      retry: result.retry,
      duration: result.duration,
      step: findFailedStep(result.steps),
      error: error && stripVTControlCharacters(error).replace(/^Error: /, '')
    })
  }

  onError(error) {
    const message = stripVTControlCharacters(error.message ?? String(error.value))

    this.errors.push(message)
    this.print(paint('gray', `  ${paint('red', `✘ ${message}`)}`))
  }

  onEnd() {
    this.printSummary()
  }

  testEnd(event) {
    const kind = KINDS[event.kind]

    this.durations += event.duration

    if (event.kind !== 'retrying') {
      this.done++
      this.counts[event.kind]++
      if (this.finished[event.kind]) this.finished[event.kind].push(event)
    }

    const counter = paint(
      'gray',
      `[${String(this.done).padStart(String(this.total).length)}/${this.total}]`
    )
    // the slots are numbered from 1, as Playwright's own reporters do
    const worker = event.worker ? paint('gray', `w${event.worker} `) : ''
    const repeat = event.repeat ? paint('gray', ` #${event.repeat}`) : ''
    const retry = event.retry ? paint('yellow', ` retry #${event.retry}`) : ''
    const note = event.kind === 'passed' ? '' : paint(kind.color, ` ${event.note ?? kind.label}`)
    const lines = [
      `  ${paint(kind.color, kind.icon)} ${counter} ${worker}${paint('gray', `${event.feature} ›`)} ${event.name}` +
        `${repeat}${retry} ${paint('gray', `(${formatDuration(event.duration)})`)}${note}`
    ]

    if (['failed', 'retrying', 'knownFixed'].includes(event.kind)) {
      lines.push(...this.formatError(event, 6))
    } else if (event.kind === 'known' && event.error) {
      lines.push(
        ...this.formatError(event, 1).map(line => paint('gray', stripVTControlCharacters(line)))
      )
    }

    this.print(lines.join('\n'))
  }

  formatError({ step, error }, maxLines) {
    const indent = '        '
    const lines = []

    if (step) lines.push(`${indent}${paint('gray', 'Step:')}  ${step}`)
    if (error) {
      const errorLines = error.split('\n').filter(line => line.trim())

      errorLines.slice(0, maxLines).forEach((line, index) => {
        lines.push(
          `${indent}${paint('gray', index === 0 ? 'Error:' : '      ')} ${paint('red', line)}`
        )
      })
      if (errorLines.length > maxLines && maxLines > 1)
        lines.push(`${indent}       ${paint('gray', '…')}`)
    }

    return lines
  }

  drawBar() {
    if (!isTTY || !this.headerPrinted) return

    const ratio = this.total ? this.done / this.total : 0
    const filled = Math.round(ratio * BAR_WIDTH)
    const elapsed = Date.now() - this.startTime
    const average = this.done ? this.durations / this.done : 0
    // the workers run the rest at the same time
    const left = average ? (average * (this.total - this.done)) / this.workers : 0
    const { failed, known, flaky, knownFixed } = this.counts
    const [current] = this.running.values()
    const parts = [
      paint('cyan', SPINNER[this.frame++ % SPINNER.length]),
      paint('cyan', '━'.repeat(filled)) + paint('gray', '─'.repeat(BAR_WIDTH - filled)),
      `${this.done}/${this.total}`,
      paint('bold', `${Math.floor(ratio * 100)}%`),
      paint('green', `✓ ${this.counts.passed + flaky}`),
      paint(failed + knownFixed ? 'red' : 'gray', `✘ ${failed + knownFixed}`),
      paint(known ? 'magenta' : 'gray', `◆ ${known}`),
      paint(flaky ? 'yellow' : 'gray', `⚠ ${flaky}`),
      paint(
        'gray',
        `│ ${formatDuration(elapsed)}${left ? `, ~${formatDuration(left)} left` : ''} │`
      )
    ].join('  ')

    // a wrapped line can't be redrawn
    let line =
      visibleLength(parts) + 3 > (out.columns || 120)
        ? `${this.done}/${this.total} ${Math.floor(ratio * 100)}%`
        : parts

    if (current && line === parts) {
      const duration = formatDuration(Date.now() - current.start)
      const name = this.running.size > 1 ? `${this.running.size} running` : current.name
      const width = (out.columns || 120) - visibleLength(parts) - duration.length - 8

      line += width > 10 ? `  ▶ ${truncate(name, width)} ${paint('gray', duration)}` : ''
    }

    out.write(`\r\x1b[2K  ${line}`)
    this.barShown = true
  }

  clearBar() {
    if (this.barShown) out.write('\r\x1b[2K')
    this.barShown = false
  }

  print(text) {
    this.clearBar()
    out.write(`${text}\n`)
    this.drawBar()
  }

  printSummary() {
    clearInterval(this.timer)
    this.clearBar()
    if (isTTY) out.write('\x1b[?25h')

    const { passed, failed, known, knownFixed, flaky, skipped, interrupted } = this.counts
    const isFailed = failed + knownFixed + this.errors.length > 0
    const listSection = (title, kind, events, withError) => {
      if (!events.length) return []

      return [
        '',
        paint(['bold', KINDS[kind].color], `  ${title} (${events.length})`),
        ...events.flatMap(event => [
          `    ${paint(KINDS[kind].color, KINDS[kind].icon)} ${paint('gray', `${event.feature} ›`)} ${event.name}` +
            (event.repeat ? paint('gray', ` #${event.repeat}`) : ''),
          ...(withError ? this.formatError(event, 3) : [])
        ])
      ]
    }
    const totals = [
      paint('green', `✓ ${passed + flaky} passed`),
      paint(flaky ? 'yellow' : 'gray', `⚠ ${flaky} flaky`),
      paint(failed + knownFixed ? 'red' : 'gray', `✘ ${failed + knownFixed} failed`),
      paint(known ? 'magenta' : 'gray', `◆ ${known} known bugs`),
      paint('gray', `○ ${skipped} skipped`),
      ...(interrupted ? [paint('gray', `■ ${interrupted} interrupted`)] : [])
    ]

    console.log(
      [
        '',
        paint('gray', `  ${'─'.repeat(60)}`),
        `  ${paint(['bold', isFailed ? 'red' : 'green'], isFailed ? 'FAILED' : 'PASSED')}  ` +
          `${this.done}/${this.total} scenarios in ${formatDuration(Date.now() - this.startTime)}`,
        `  ${totals.join('   ')}`,
        ...listSection('Failed', 'failed', this.finished.failed, true),
        ...listSection(
          'Known bugs passed, remove the tag',
          'knownFixed',
          this.finished.knownFixed,
          false
        ),
        ...listSection('Flaky (passed on a retry)', 'flaky', this.finished.flaky, false),
        ...listSection('Known bugs (failed as expected)', 'known', this.finished.known, false),
        ...(this.errors.length
          ? ['', paint(['bold', 'red'], '  Errors'), ...this.errors.map(error => `    ${error}`)]
          : []),
        ''
      ].join('\n')
    )
  }
}
