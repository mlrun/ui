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
// Console output of the E2E regression: a line per scenario, the failure details, a live progress bar (in a terminal)
// and the summary. It's driven by the events of console-reporter.js: directly, or through scripts/testRegression.js,
// which combines the events of the parallel shards
import { stripVTControlCharacters, styleText } from 'node:util'

export const EVENT_PREFIX = '@@e2e-event '

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

export const formatDuration = ms => {
  const seconds = Math.round(ms / 1000)

  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  if (seconds < 3600)
    return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, '0')}s`

  return `${Math.floor(seconds / 3600)}h ${String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')}m`
}

const visibleLength = text => stripVTControlCharacters(text).length
const truncate = (text, width) => (text.length > width ? `${text.slice(0, width - 1)}…` : text)

export class ConsoleRenderer {
  constructor({ shards = 1 } = {}) {
    this.shards = shards
    this.total = 0
    this.done = 0
    this.counts = Object.fromEntries(Object.keys(KINDS).map(kind => [kind, 0]))
    this.finished = { failed: [], flaky: [], known: [], knownFixed: [] }
    this.running = new Map()
    this.durations = 0
    this.errors = []
    this.startTime = Date.now()
    this.frame = 0
    this.barShown = false
    this.timer = null
  }

  handle(event) {
    switch (event.type) {
      case 'begin':
        this.total += event.total
        if (!this.headerPrinted) this.printHeader(event)
        break
      case 'testBegin':
        this.running.set(event.id, { name: event.name, start: Date.now() })
        this.drawBar()
        break
      case 'testEnd':
        this.running.delete(event.id)
        this.testEnd(event)
        break
      case 'error':
        this.errors.push(event.message)
        this.log(paint('red', `✘ ${event.message}`))
        break
      case 'log':
        this.log(event.text)
        break
    }
  }

  printHeader({ retries, workers, tags, headless }) {
    this.headerPrinted = true

    // the header is printed when the first shard starts, the total of all the shards is not known yet
    const details = [
      ...(this.shards > 1
        ? [`${this.shards} shards`]
        : [
            `${this.total} scenario${this.total === 1 ? '' : 's'}`,
            `${workers} worker${workers === 1 ? '' : 's'}`
          ]),
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
    const shard = event.shard ? paint('gray', `s${event.shard} `) : ''
    const retry = event.retry ? paint('yellow', ` retry #${event.retry}`) : ''
    const note = event.kind === 'passed' ? '' : paint(kind.color, ` ${event.note ?? kind.label}`)
    const lines = [
      `  ${paint(kind.color, kind.icon)} ${counter} ${shard}${paint('gray', `${event.feature} ›`)} ${event.name}` +
        `${retry} ${paint('gray', `(${formatDuration(event.duration)})`)}${note}`
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
    const left = average ? (average * (this.total - this.done)) / this.shards : 0
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

  log(text) {
    this.print(paint('gray', `  ${text}`))
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
          `    ${paint(KINDS[kind].color, KINDS[kind].icon)} ${paint('gray', `${event.feature} ›`)} ${event.name}`,
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
