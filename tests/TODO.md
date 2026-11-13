# E2E tests: open questions and follow-ups

To discuss and decide. Each item says what was found, why it matters and the options.

## Decisions about the accuracy of the checks

### 1. Should the lists be compared in order?

The tab, header and option lists (`verify "X" on "Y" wizard should contains "Consts"."List"`, ~200 uses, and
`dropdown ... should contains`, ~150 uses) now must have exactly the expected items, each as many times as expected
(`expectSameItems` in `tests/features/common-tools/element.js`). The order is not checked: the steps say "contains".

- If the order is a requirement (the tabs, the overview headers), a wrong order passes now.
- Option: check the order, everywhere or only for the tabs/headers. The lists in `common-consts.js` would have to be in
  the order the app shows them (a full run shows where they differ).

### 2. Replace the wildcards of the expected messages with the expected values?

The "should be equal" message checks (`{string} component on {string} should be equal {string}.{string}`, 66 uses) now
match the whole text. Many patterns in `tests/features/common-tools/common-consts.js` have `(.+?)` for the variable part,
e.g. `No data matches the filter: "Name: (.+?)"`, `Delete_Run_Message`, `Info_Banner_Message` (`/The (.+?) is not .../`).

- They pass with any value there: a wrong name, a wrong UID, "dataset" instead of "model".
- Option: a step that takes the expected value from the scenario (e.g. `... should be equal "X" with "my-name"`), or
  narrow `(.+?)` to `[^,"]+` at least.

### 3. "contains" steps that are used as "equals"

A few scenarios use a substring check where the exact value is meant:

- `... should contains {string} attribute value` (7 uses): `models.feature:1674`, `:1737` expect the Version_Tag filter
  to show "latest" - a filter that kept "latest123456" passes.
- `verify {string} on {string} wizard should contains {string} value` (3 uses: `jobsAndWorkflows.feature:2152`,
  `models.feature:1554`, `:1558`) - "clean-data" passes on "clean-data-copy".
- `check {string} header value in {string} column ...` (46 uses) - "Runs" passes on "Runs (old)".
- Option: add exact variants and switch these lines to them.

### 4. Low-confidence findings, not changed

Found by the review of the step definitions and the helpers, each can hide a defect only in a rare case:

- the notification text is read with `.first()` (the oldest notification, `steps.js` "... should contains {string}
  value", 80 uses): an earlier notification with the same text can satisfy a check of a new one that wasn't shown;
- `componentIsNotVisible` checks only the first matched element;
- "collapsed" (`isAccordionSectionCollapsed`) checks only the icon class, not that the section body is hidden;
- the action menu checks (`verify options in action menu ...`, 53 uses) read the row index once: a table that re-sorts
  meanwhile (running jobs) shows the menu of another row;
- the invalid strings of the rules check are not checked to be typed exactly (a leftover of the previous value could
  make the field invalid for another reason);
- the rules parser: the prefix rules (`[Prefix] ...`, "Must not start with 'kubernetes.io'") and "This field is
  required" are not checked; "Max length between two periods" can be taken for the length rule (no current field has it).

## Next steps

### 5. Defect injection: prove that the checks catch a broken app

Break the mock data behind a sample of scenarios on purpose (e.g. a wrong run status, a missing label, a duplicated tab,
a changed name) and check that each of them fails. It shows the checks that still pass on a broken app (a false pass)
better than any review. To do once the full regression is green.

### 6. The fixed waits in the feature files

13 `wait for N seconds` steps, 4 x 47 s in projectsPage (MLRun unhealthy): replace them with waits for the expected
state, e.g. `verify "X" element visibility within N seconds`. Saves ~4-5 minutes per run.

### 7. One mock server and one app for all the workers

Now every worker runs its own mock server and app (~300 MB together). The mock server could keep the state per worker
(a header with the worker index), then one mock server and one app serve all the workers and the parallel run is
Playwright's own (`--workers N`, one reporter, one report).

### 8. The known bugs without an entry in KNOWN_BUGS.md

MLPS008, MLPH001, MLF015, MLF033 and MLFS056 are tagged `@knownBug` with no description. A tag is right only for a bug
that the scenario hits every time: check that each of them still fails because of its bug (not because of something
else), describe them in `tests/KNOWN_BUGS.md`, or handle them as recognized bugs (`failAsKnownBug`) if they show up only
sometimes.

### 9. The Selenium leftovers cleanup

Planned after the tests are stable. Includes the unused step definitions found by the review: `verify filled data in`,
the subtable "should contains", `check ... not visible in`, `expand each row`, and the context value step without
`split` (0 uses each).
