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
// The summary of an E2E regression run on CI (.github/workflows/e2e.yaml), also after a failed run: the result line,
// the selection, the workers, the duration, the resource verdict (from the log of scripts/e2eResources.sh: did the
// runner keep up with the workers?) and the slowest scenarios (the Allure results). Markdown, appended to
// $GITHUB_STEP_SUMMARY (printed when it isn't set), the overload signs are also GitHub warnings.
//
// The environment: E2E_CONSOLE_LOG, E2E_RESOURCES_LOG, E2E_ALLURE_RESULTS (the defaults in tests/reports),
// E2E_TAGS, E2E_WORKERS (the requested ones, the console log has the resolved number), E2E_STARTED_AT and
// E2E_FINISHED_AT (epoch seconds of the test step), E2E_EXIT_CODE, E2E_SLOWEST (the number of scenarios, 10)
import fs from 'node:fs'
import path from 'node:path'
import { stripVTControlCharacters } from 'node:util'

const env = process.env
const reportsDir = path.join('tests', 'reports')
const consoleLog = env.E2E_CONSOLE_LOG || path.join(reportsDir, 'e2e-console.log')
const resourcesLog = env.E2E_RESOURCES_LOG || path.join(reportsDir, 'e2e-resources.log')
const allureResultsDir = env.E2E_ALLURE_RESULTS || path.join(reportsDir, 'allure-results')
const slowestCount = Number(env.E2E_SLOWEST || 10)

// the overload thresholds
const LOAD_PER_CPU_P95 = 2
const MIN_MEM_AVAILABLE_MB = 1024
// swap used above the one at the start of the run
const SWAP_GROWTH_MB = 64
const IOWAIT_P95_PERCENT = 20
const IDLE_MEDIAN_PERCENT = 10

const readText = file => {
  try {
    return stripVTControlCharacters(fs.readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}

const formatDuration = seconds => {
  const s = Math.round(seconds)

  if (s < 60) return `${s}s`
  if (s < 3600) return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`

  return `${Math.floor(s / 3600)}h ${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}m`
}

const formatMB = kB =>
  kB >= 1024 * 1024 ? `${(kB / 1024 / 1024).toFixed(1)} GB` : `${Math.round(kB / 1024)} MB`
const percent = value => `${value.toFixed(1)}%`

// nearest rank
const percentile = (values, p) => {
  if (!values.length) return NaN

  const sorted = [...values].sort((a, b) => a - b)

  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1))]
}

// the result of the console reporter (tests/reporters/console-reporter.js): "PASSED  348/348 scenarios in 15m 02s"
// and the totals line after it; and the resolved settings line of scripts/testRegression.js
export const parseConsoleLog = text => {
  const lines = (text ?? '').split('\n')
  const resultIndex = lines.findIndex(line =>
    /^\s*(PASSED|FAILED)\s+\d+\/\d+ scenarios? in /.test(line)
  )
  const settings = lines.find(line => line.startsWith('E2E regression: '))

  return {
    result: resultIndex >= 0 ? lines[resultIndex].trim().replace(/\s{2,}/g, ' ') : null,
    totals:
      resultIndex >= 0 ? (lines[resultIndex + 1] ?? '').trim().replace(/\s{2,}/g, ' · ') : null,
    workers: settings?.match(/workers=(\d+)/)?.[1] ?? null
  }
}

// the lines of scripts/e2eResources.sh
export const parseResourcesLog = text => {
  const header = {}
  const samples = []

  for (const line of (text ?? '').split('\n')) {
    if (!line.trim()) continue
    if (line.startsWith('#')) {
      for (const [, key, value] of line.matchAll(/(\w+)=(\S+)/g)) header[key] = Number(value)
      continue
    }

    const fields = Object.fromEntries([...line.matchAll(/(\w+)=(\S+)/g)].map(([, k, v]) => [k, v]))

    if (!fields.ts || !fields.load || !fields.cpu || !fields.MemAvailable) continue
    samples.push({
      ts: Number(fields.ts),
      load1: Number(fields.load.split(',')[0]),
      // user nice system idle iowait irq softirq steal (guest and guest_nice are counted in user and nice)
      cpu: fields.cpu.split(',').slice(0, 8).map(Number),
      procsBlocked: Number(fields.procs_blocked ?? 0),
      memTotal: Number(fields.MemTotal),
      memAvailable: Number(fields.MemAvailable),
      swapUsed: Number(fields.SwapTotal ?? 0) - Number(fields.SwapFree ?? 0),
      swapTotal: Number(fields.SwapTotal ?? 0)
    })
  }

  return { header, samples }
}

export const analyzeResources = ({ header, samples }) => {
  if (samples.length < 2) return null

  const cpus = header.cpus || 1
  const loads = samples.map(sample => sample.load1)
  const idle = []
  const iowait = []
  const steal = []

  for (let i = 1; i < samples.length; i++) {
    const delta = samples[i].cpu.map((value, k) => value - (samples[i - 1].cpu[k] ?? 0))
    const total = delta.reduce((sum, value) => sum + value, 0)

    if (total <= 0) continue
    idle.push((100 * delta[3]) / total)
    iowait.push((100 * (delta[4] ?? 0)) / total)
    steal.push((100 * (delta[7] ?? 0)) / total)
  }

  const minMem = samples.reduce((min, sample) =>
    sample.memAvailable < min.memAvailable ? sample : min
  )
  const maxSwap = samples.reduce((max, sample) => (sample.swapUsed > max.swapUsed ? sample : max))
  const stats = {
    cpus,
    interval: header.interval,
    samples: samples.length,
    span: samples[samples.length - 1].ts - samples[0].ts,
    memTotal: samples[0].memTotal,
    load: { median: percentile(loads, 50), p95: percentile(loads, 95), max: Math.max(...loads) },
    idle: { median: percentile(idle, 50), p5: percentile(idle, 5) },
    iowait: { median: percentile(iowait, 50), p95: percentile(iowait, 95) },
    steal: { median: percentile(steal, 50), p95: percentile(steal, 95) },
    procsBlockedMax: Math.max(...samples.map(sample => sample.procsBlocked)),
    memAvailableMin: minMem.memAvailable,
    memAvailableMinAt: minMem.ts - samples[0].ts,
    swapTotal: samples[0].swapTotal,
    swapStart: samples[0].swapUsed,
    swapMax: maxSwap.swapUsed
  }
  const warnings = []

  if (stats.load.p95 > LOAD_PER_CPU_P95 * cpus) {
    warnings.push(
      `load average p95 ${stats.load.p95.toFixed(1)} is above ${LOAD_PER_CPU_P95}× the ${cpus} CPUs: the processes wait for a CPU`
    )
  }
  if (stats.idle.median < IDLE_MEDIAN_PERCENT) {
    warnings.push(
      `CPU idle median ${percent(stats.idle.median)}: the CPUs are saturated most of the run`
    )
  }
  if (stats.iowait.p95 > IOWAIT_P95_PERCENT) {
    warnings.push(`CPU iowait p95 ${percent(stats.iowait.p95)}: the disk holds the run back`)
  }
  if (stats.memAvailableMin < MIN_MEM_AVAILABLE_MB * 1024) {
    warnings.push(`MemAvailable went down to ${formatMB(stats.memAvailableMin)} (below 1 GB)`)
  }
  if (stats.swapMax - stats.swapStart > SWAP_GROWTH_MB * 1024) {
    warnings.push(
      `swap in use: up to ${formatMB(stats.swapMax)} (${formatMB(stats.swapStart)} at the start): the memory ran short`
    )
  }

  return { stats, warnings }
}

// the attempts of the scenarios (a retry is an attempt of its own), the slowest first
export const readSlowest = (dir, count) => {
  let files

  try {
    files = fs.readdirSync(dir).filter(file => file.endsWith('-result.json'))
  } catch {
    return { attempts: 0, totalSeconds: 0, slowest: [] }
  }

  const attempts = files
    .map(file => {
      try {
        return JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
      } catch {
        return null
      }
    })
    .filter(result => result?.start && result?.stop)
    .map(result => ({
      name: result.name,
      seconds: (result.stop - result.start) / 1000,
      status: result.statusDetails?.known ? 'known bug' : result.status,
      retry: result.parameters?.some(parameter => parameter.name === 'Retry') ?? false,
      worker: result.labels
        ?.find(label => label.name === 'thread')
        ?.value?.match(/worker-(\d+)/)?.[1]
    }))

  return {
    attempts: attempts.length,
    totalSeconds: attempts.reduce((sum, attempt) => sum + attempt.seconds, 0),
    slowest: attempts.sort((a, b) => b.seconds - a.seconds).slice(0, count)
  }
}

const escapeCell = text => String(text).replace(/\|/g, '\\|')

export const buildSummary = ({ run, resources, scenarios, settings }) => {
  const lines = ['## E2E regression', '']

  if (run.result) {
    lines.push(`**${run.result}**`, '', run.totals ? `${run.totals}` : '', '')
  } else {
    lines.push(
      `**No result line**: the run stopped before the tests ended (exit code ${settings.exitCode ?? '?'}), see the console log artifact`,
      ''
    )
  }

  const workers = run.workers ?? (settings.workers || 'the default (half of the CPUs)')

  lines.push(
    '| | |',
    '| --- | --- |',
    `| Selection | \`${escapeCell(settings.tags || 'all')}\` |`,
    `| Workers | ${workers}${resources ? ` (${resources.stats.cpus} CPUs)` : ''} |`,
    `| Duration | ${settings.duration ? formatDuration(settings.duration) : '?'} (the test step: the build, the servers, the tests, the report) |`,
    ...(scenarios.attempts && settings.duration
      ? [
          `| Scenario time | ${formatDuration(scenarios.totalSeconds)} in ${scenarios.attempts} attempts, ${(scenarios.totalSeconds / settings.duration).toFixed(1)} running at a time on average |`
        ]
      : []),
    ''
  )

  lines.push(
    run.workers || resources
      ? `### Resources: ${workers} worker${String(workers) === '1' ? '' : 's'} on ${resources ? resources.stats.cpus : '?'} CPUs`
      : '### Resources',
    ''
  )

  if (!resources) {
    lines.push(
      'No resource samples (scripts/e2eResources.sh): the sampler did not run or the run was too short.',
      ''
    )
  } else {
    const { stats, warnings } = resources
    const perCpu = value => `${value.toFixed(2)} (${(value / stats.cpus).toFixed(2)}× CPUs)`

    lines.push(
      warnings.length
        ? `> [!WARNING]\n> **Looks overloaded**: ${warnings.join('; ')}. Try fewer workers in a manual run (README.md, "CI").`
        : `**No overload signs** (load p95 ≤ ${LOAD_PER_CPU_P95}× CPUs, MemAvailable ≥ 1 GB, no swap growth, iowait p95 ≤ ${IOWAIT_P95_PERCENT}%).`,
      '',
      ...(String(workers) === '4'
        ? []
        : [
            'To compare: Actions > E2E regression > Run workflow with `workers=4` (the default is 3), then compare the two summaries.',
            ''
          ]),
      '| | median | p95 | extreme |',
      '| --- | --- | --- | --- |',
      `| Load average (1 min) | ${perCpu(stats.load.median)} | ${perCpu(stats.load.p95)} | max ${stats.load.max.toFixed(2)} |`,
      `| CPU idle | ${percent(stats.idle.median)} | | p5 ${percent(stats.idle.p5)} |`,
      `| CPU iowait | ${percent(stats.iowait.median)} | ${percent(stats.iowait.p95)} | |`,
      `| CPU steal | ${percent(stats.steal.median)} | ${percent(stats.steal.p95)} | |`,
      `| MemAvailable | | | min ${formatMB(stats.memAvailableMin)} of ${formatMB(stats.memTotal)}, ${formatDuration(stats.memAvailableMinAt)} into the run |`,
      `| Swap used | | | max ${formatMB(stats.swapMax)} (${formatMB(stats.swapStart)} at the start, ${formatMB(stats.swapTotal)} swap) |`,
      `| Blocked processes | | | max ${stats.procsBlockedMax} |`,
      '',
      `${stats.samples} samples every ${stats.interval ?? '?'} s over ${formatDuration(stats.span)}, the raw log is the e2e-resources artifact.`,
      ''
    )
  }

  if (scenarios.slowest.length) {
    lines.push(
      `### The slowest scenarios`,
      '',
      '| Scenario | Duration | Result | Worker index |',
      '| --- | --- | --- | --- |',
      ...scenarios.slowest.map(
        attempt =>
          `| ${escapeCell(attempt.name)} | ${formatDuration(attempt.seconds)} | ${attempt.status}${attempt.retry ? ' (retry)' : ''} | ${attempt.worker ?? ''} |`
      ),
      ''
    )
  }

  return lines.join('\n')
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)

if (isMain) {
  const startedAt = Number(env.E2E_STARTED_AT)
  const finishedAt = Number(env.E2E_FINISHED_AT) || Math.round(Date.now() / 1000)
  const run = parseConsoleLog(readText(consoleLog))
  const resources = analyzeResources(parseResourcesLog(readText(resourcesLog)))
  const scenarios = readSlowest(allureResultsDir, slowestCount)
  const summary = buildSummary({
    run,
    resources,
    scenarios,
    settings: {
      tags: env.E2E_TAGS,
      workers: env.E2E_WORKERS,
      exitCode: env.E2E_EXIT_CODE,
      duration: startedAt ? finishedAt - startedAt : null
    }
  })

  if (env.GITHUB_STEP_SUMMARY) fs.appendFileSync(env.GITHUB_STEP_SUMMARY, `${summary}\n`)
  else console.log(summary)

  if (env.GITHUB_ACTIONS) {
    for (const warning of resources?.warnings ?? []) {
      console.log(`::warning title=E2E runner overloaded?::${warning}`)
    }
  }
}
