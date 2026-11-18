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
// Guard against several E2E runs at once: every run starts its own app server, mock server and browsers, so runs in
// parallel grow the memory usage until the machine freezes.
//  - one run at a time: the lock file holds the pid of the running one (a lock of a dead process is taken over);
//  - a parallel run, `E2E_WORKERS` > 1, can be started only by a person: from an interactive terminal (or CI);
//  - when another run is in progress, a person is asked whether to stop it and start the new one, a non-interactive
//    start (e.g. an agent) is refused and must wait for the running one.
// `npm run test:regression` takes the lock itself and passes it to its Playwright run (`E2E_LOCK_OWNER`), a direct
// `playwright test` takes it in the global setup (tests/global-setup.js).
import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import { execFileSync, spawnSync } from 'node:child_process'

import { reports_dir } from './config.js'

// E2E_MAX_WORKERS (or the previous name E2E_MAX_SHARDS) - the upper limit of E2E_WORKERS
export const MAX_WORKERS = Number(process.env.E2E_MAX_WORKERS || process.env.E2E_MAX_SHARDS || 4)

const lockFile = path.join(reports_dir, '.e2e-run.lock')
const isWindows = process.platform === 'win32'
const isInteractive = () => Boolean(process.stdin.isTTY)

const isAlive = pid => {
  try {
    process.kill(pid, 0)

    return true
  } catch (error) {
    // EPERM - the process exists but belongs to another user
    return error.code === 'EPERM'
  }
}

const readLock = () => {
  try {
    return JSON.parse(fs.readFileSync(lockFile, 'utf8'))
  } catch {
    return null
  }
}

export const releaseRunLock = () => {
  if (readLock()?.pid === process.pid) fs.rmSync(lockFile, { force: true })
}

const getDescendants = pid => {
  const rows = execFileSync('ps', ['-A', '-o', 'pid=,ppid='], { encoding: 'utf8' })
    .trim()
    .split('\n')
    .map(line => line.trim().split(/\s+/).map(Number))
  const descendants = []
  const collect = parent =>
    rows
      .filter(([, ppid]) => ppid === parent)
      .forEach(([child]) => {
        descendants.push(child)
        collect(child)
      })

  collect(pid)

  return descendants
}

// stops the run with everything it started (Playwright workers, servers, browsers)
const stopRun = async pid => {
  if (isWindows) {
    spawnSync('taskkill', ['/pid', String(pid), '/T', '/F'])
  } else {
    const processes = [...getDescendants(pid).reverse(), pid]
    const signalAll = signal =>
      processes.forEach(item => {
        try {
          process.kill(item, signal)
        } catch {
          // already gone
        }
      })

    signalAll('SIGTERM')

    for (let i = 0; i < 50 && processes.some(isAlive); i++) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    signalAll('SIGKILL')
  }

  for (let i = 0; i < 50 && isAlive(pid); i++) {
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}

const confirm = async question => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const answer = await new Promise(resolve => rl.question(question, resolve))

  rl.close()

  return /^y(es)?$/i.test(answer.trim())
}

// throws when the run must not be started, returns the release function.
// `parallel` - the run has more than one worker
export const acquireRunLock = async ({ parallel = false } = {}) => {
  // the Playwright run started by `npm run test:regression` (or `test:defects`), which holds the lock
  if (process.env.E2E_LOCK_OWNER && isAlive(Number(process.env.E2E_LOCK_OWNER))) return () => {}

  if (parallel && !isInteractive() && !process.env.CI) {
    throw new Error(
      'Parallel runs (E2E_WORKERS > 1) can be started only by a person from an interactive terminal. ' +
        'Run the scenarios sequentially (E2E_WORKERS=1) or ask the user to start the parallel run.'
    )
  }

  fs.mkdirSync(reports_dir, { recursive: true })

  for (let attempt = 0; attempt < 3; attempt++) {
    // written in full to a file of this process first, then linked as the lock: the link fails if the lock exists, so
    // only one process can take it, and the lock is never seen half-written (an unreadable lock would be taken over)
    const ownFile = `${lockFile}.${process.pid}`

    fs.writeFileSync(
      ownFile,
      JSON.stringify({
        pid: process.pid,
        startedAt: new Date().toISOString(),
        cwd: process.cwd()
      })
    )

    try {
      fs.linkSync(ownFile, lockFile)
      process.env.E2E_LOCK_OWNER = String(process.pid)

      return releaseRunLock
    } catch (error) {
      if (error.code !== 'EEXIST') throw error

      const lock = readLock()

      if (lock && lock.pid !== process.pid && isAlive(lock.pid)) {
        const description = `Another E2E run is in progress (pid ${lock.pid}, started ${lock.startedAt})`

        if (!isInteractive()) {
          throw new Error(
            `${description}. Wait until it ends: parallel runs exhaust the memory. ` +
              'Only a person can stop it and start a new run.'
          )
        }

        if (
          !(await confirm(
            `${description}.\nStop it (with its servers and browsers) and start the new run? [y/N] `
          ))
        ) {
          throw new Error('The new run is not started: the running one is left as is.')
        }

        await stopRun(lock.pid)
      }

      // a stale (or stopped) lock, unless another process has replaced it meanwhile
      if (JSON.stringify(readLock()) === JSON.stringify(lock)) fs.rmSync(lockFile, { force: true })
    } finally {
      fs.rmSync(ownFile, { force: true })
    }
  }

  throw new Error(`Cannot take the E2E run lock: ${lockFile}`)
}
