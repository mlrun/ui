# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: known.spec.mjs >> bug shows up
- Location: .tmp-pwcheck/known.spec.mjs:3:1

# Error details

```
Error: Known bug BUG-001 (tests/KNOWN_BUGS.md): cut
```

# Test source

```ts
  1  | /*
  2  | Copyright 2019 Iguazio Systems Ltd.
  3  | 
  4  | Licensed under the Apache License, Version 2.0 (the "License") with
  5  | an addition restriction as set forth herein. You may not use this
  6  | file except in compliance with the License. You may obtain a copy of
  7  | the License at http://www.apache.org/licenses/LICENSE-2.0.
  8  | 
  9  | Unless required by applicable law or agreed to in writing, software
  10 | distributed under the License is distributed on an "AS IS" BASIS,
  11 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
  12 | implied. See the License for the specific language governing
  13 | permissions and limitations under the License.
  14 | 
  15 | In addition, you may not use the software for any purposes that are
  16 | illegal under applicable law, and the grant of the foregoing license
  17 | under the Apache 2.0 license is conditioned upon your compliance with
  18 | such restriction.
  19 | */
  20 | // Known app bugs that a scenario hits only sometimes (tests/KNOWN_BUGS.md). Such a scenario is not tagged `@knownBug`:
  21 | // it would fail as "known bug passed" whenever the bug doesn't show up. The bug is recognized when it happens (by its
  22 | // signature, at the step it breaks): the scenario is then expected to fail and is reported as the known bug. When the
  23 | // bug doesn't show up, the scenario must pass; any other failure fails it as usual
  24 | export const KNOWN_BUG_MESSAGE_PREFIX = 'Known bug'
  25 | 
  26 | export const failAsKnownBug = (testInfo, id, details) => {
  27 |   testInfo.fail(true, `${id} (tests/KNOWN_BUGS.md)`)
  28 | 
> 29 |   throw new Error(`${KNOWN_BUG_MESSAGE_PREFIX} ${id} (tests/KNOWN_BUGS.md): ${details}`)
     |         ^ Error: Known bug BUG-001 (tests/KNOWN_BUGS.md): cut
  30 | }
  31 | 
```