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
// Known app bugs that a scenario hits only sometimes (tests/KNOWN_BUGS.md). Such a scenario is not tagged `@knownBug`:
// it would fail as "known bug passed" whenever the bug doesn't show up. The bug is recognized when it happens (by its
// signature, at the step it breaks): the scenario is then expected to fail and is reported as the known bug. When the
// bug doesn't show up, the scenario must pass; any other failure fails it as usual
export const KNOWN_BUG_MESSAGE_PREFIX = 'Known bug'

export const failAsKnownBug = (testInfo, id, details) => {
  testInfo.fail(true, `${id} (tests/KNOWN_BUGS.md)`)

  throw new Error(`${KNOWN_BUG_MESSAGE_PREFIX} ${id} (tests/KNOWN_BUGS.md): ${details}`)
}
