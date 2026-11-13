# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: known.spec.mjs >> another failure
- Location: .tmp-pwcheck/known.spec.mjs:5:1

# Error details

```
Error: a regression
```

# Test source

```ts
  1 | import { test } from '@playwright/test'
  2 | import { failAsKnownBug } from '../tests/features/common-tools/known-bugs.js'
  3 | test('bug shows up', async ({}, testInfo) => { failAsKnownBug(testInfo, 'BUG-001', 'cut') })
  4 | test('bug does not show up', async () => {})
> 5 | test('another failure', async () => { throw new Error('a regression') })
    |                                             ^ Error: a regression
  6 | 
```