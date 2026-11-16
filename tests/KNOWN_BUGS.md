# Known bugs found by the E2E tests

A known bug is handled in one of two ways, so that it never makes the run red by itself and a regression still does:

- **A bug that a scenario hits every time**: the scenario is tagged `@knownBug`, it is expected to fail (reported as
  "known bug, failed as expected"). A tagged scenario that passes is reported as a failure ("the bug looks fixed, remove
  the tag"): after the fix remove the tag and move the bug to "Fixed".
- **A bug that shows up only sometimes**: a tag would make the run red whenever the bug doesn't show up. The scenario is
  not tagged, the bug is recognized when it happens, by its signature at the step it breaks (`failAsKnownBug`,
  `tests/features/common-tools/known-bugs.js`): the scenario is then reported as the known bug (the message starts
  with "Known bug BUG-NNN"). When the bug doesn't show up, the scenario must pass; any other failure fails it.

Test-side lists of the older known bugs (`@knownBug`/`@FAILED_TODO` in the feature files) are not duplicated here yet.

## Open

### BUG-001 - A long label key loses its tail while it is typed (the chip editing ends by itself)

|           |                                                                                                                                                                                                                                               |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scenario  | `MLPr007 - Create new ML Project with description` (`tests/features/projectsPage.feature`), step `verify "Labels_Key" options rules on "Create_New_Project" wizard with labels`                                                               |
| Where     | New Project dialog -> Labels -> the key field of a label chip (the same chip form is used by every label field: Jobs, Functions, Artifacts, ...)                                                                                              |
| Component | `src/igz-controls/components/FormChipCell/NewChipForm/NewChipForm.jsx` (`handleScroll`)                                                                                                                                                       |
| Found     | 2026-11-12, as a flaky MLPr007 (about 10-15% of the runs failed at the first attempt)                                                                                                                                                         |
| Handled   | Recognized when it happens (it shows up only sometimes): `recognizeLabelKeyCut` in `tests/features/common/actions/input-group.action.js` - a valid label key that the field doesn't keep whole (a beginning of it, or the chip input is gone) |

#### What happens

While the key is typed, the validation rules popup is shown. Once the typed text is wider than the input, the browser
scrolls the text inside the input and fires a `scroll` event. `NewChipForm` listens to `scroll` on `window` in the capture
phase while the rules popup is shown, so it gets the event of the input too:

```js
const handleScroll = useCallback(
  event => {
    if (validationRulesRef?.current && !validationRulesRef.current.contains(event.target)) {
      setShowValidationRules(false)
      outsideClick(event, true) // finishes the editing of the chip, as a click outside of it
    }
  },
  [outsideClick]
)
```

The input itself is not inside the rules popup, so the scroll of its own text is handled as a click outside: the editing
of the chip is finished and the rest of the typed text is lost. The field keeps only the first ~46-51 characters
(the number depends on the width of the typed characters).

It does not depend on the typing speed: the same cut was got with the default speed, with 20 ms and with 100 ms between
the keys.

#### When it shows up

Only while the validation rules popup is shown, i.e. the value is invalid at the moment the text starts to overflow the
input (`handleScroll` is registered only then). A key valid at every moment of the typing (e.g. 63 x `W`) overflows,
scrolls, and is kept whole. A key with separators is invalid for a moment while it is typed (`label_` ends with
`_`), the popup is shown, and the next scroll of its text can end the editing - but not every time: the fixed key
`label_key.with-separators_label_key.with-separators_label_key1` (62) was cut in 1 of 4 attempts (2026-11-13, the prebuilt
app). It depends on the timing of the scroll event.

**Reproduced every time (2026-11-13):** `MLPS002` (Project Settings -> General -> Labels) types a key one character over
the max length (64 x `W`, the length rule check): the field has no `maxlength`, the 64th character makes the key invalid
while its text overflows, the rules popup is shown and the editing ends - the chip input is gone. The scenario is reported
as "Known bug BUG-001" on every run. (The New Project dialog, MLPr007, has `maxlength` there: the limit is checked
instead, the bug shows up only sometimes.)

Before 2026-11-13 the test checked only that the field is valid: a key cut after a letter or a digit stays valid, so the
test passed while the bug happened (a false pass), and the tag `@knownBug` made the run red whenever it didn't show up.
Now the field must keep the typed valid value exactly, and the bug is recognized by its signature.

#### Evidence (the typed string, what the field had)

```
typed  (61): 0Zz..9ZzaZA_0_aAAA9Z_0zA0_.A_.0A.ZzA9aaa_aa_0aAaa.0_zZ90zzAaA
field  (52): 0Zz..9ZzaZA_0_aAAA9Z_0zA0_.A_.0A.ZzA9aaa_aa_0aAaa.0_            <- ends with "_": invalid

typed  (62): z9A.zZA.Aa9z0Za.azzA0_00_zzAAaAa_0.Zzz_0A9_a__za..0._9__a.Zz_Z
field  (49): z9A.zZA.Aa9z0Za.azzA0_00_zzAAaAa_0.Zzz_0A9_a__za.               <- ends with ".": invalid

typed  (62): zzaa_.a_Z_ZA_zaAZZZaA9A0A_Aza09a9ZA_0Z.z09Zz9_zZ0AzA9.9_AAa_Aa  (100 ms between the keys)
field  (46): zzaa_.a_Z_ZA_zaAZZZaA9A0A_Aza09a9ZA_0Z.z09Zz9_
```

In all the 10 captured failures the text before the cut was identical to the typed one and the last kept character was
`.` or `_`. When the tests fail, the message ends with `Typed string: "..." (N), the field has: "..." (M)`
(`withTypedValueDetails` in `tests/features/common/actions/input-group.action.js`).

#### Steps to reproduce manually

1. Open the Projects page, click **New Project**.
2. In **Labels** click the field, the key input of a new chip is focused.
3. Type (or paste by typing) a key longer than the input is wide, e.g. 62 characters: `a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_`
   (try `a.a.a. ...` too).
4. Expected: the whole key is typed, the field is valid up to 63 characters (the key above ends with `_`, so it is
   invalid by the rule, use e.g. a letter at the end: `...a_a`).
   Actual: the typing stops at ~50 characters (the chip is closed as if the page was clicked), the rest is lost.
5. Check in DevTools: a `scroll` event is fired on the `<input name="key">` at the moment the text starts to overflow;
   the breakpoint in `handleScroll` is hit with `event.target` = that input.

#### Reproduce with the test

```
npm run test:regression -- --grep "MLPS002 |MLPr007 " --repeat-each=3
```

`MLPS002` is reported as the known bug ("Known bug BUG-001 ...") on every run; `MLPr007` only in the runs where the bug
shows up, it passes in the others.

#### Suggested fix

Ignore the scroll events of the chip inputs themselves in `handleScroll`, e.g.:

```js
if (
  validationRulesRef?.current &&
  !validationRulesRef.current.contains(event.target) &&
  !event.target.closest?.('.edit-chip-container')   // the key/value inputs of the chip that is edited
) {
```

(or listen only to the scroll of the scrollable containers, not of the inputs). After the fix: run MLPS002 and MLPr007 30+ times
(`--repeat-each=30`), they must never be reported as the known bug; then remove `recognizeLabelKeyCut` and move this bug
to "Fixed".

### BUG-002 - The reason of a 403 is replaced by "You do not have a permission to view this data"

|           |                                                                                                                                                                                                                          |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Scenario  | `MLPS008 - Verify Secrets table on Secrets tab` (`tests/features/projectSettings.feature`), step `"Error_Message" component on "Projects_Settings_Secret_Tab" should contains "Error_Messages"."MLRunAccessDeniedError"` |
| Where     | Project settings -> Secrets -> add a secret whose key starts with `mlrun.` (and every other error notification of a 403 that shows the reason from the response)                                                         |
| Component | `src/igz-controls/utils/common.util.js:124-126` (`getErrorMsg`, `commonErrorMessagesMap`, line 85-87)                                                                                                                    |
| Found     | 2026-11-16, MLPS008 fails at this step on every run (3 of 3)                                                                                                                                                             |
| Handled   | `@knownBug` (it shows up every time)                                                                                                                                                                                     |

#### What happens

MLRun refuses an internal secret with 403 and the reason in `detail`
(`MLRunAccessDeniedError('Not allowed to create/update internal secrets (key starts with mlrun.)')`, the mock does the same:
`postSecretKeys`, `tests/mockServer/mock.js`). `ProjectSettingsSecrets.jsx:127` shows it with
`showErrorNotification(dispatch, error, 'Failed to update secrets')`, which takes the message from `getErrorMsg`:

```js
const errorDetail = getErrorDetail(error) // the `detail` of the response
const errorMsg = errorDetail || error.message
...
if (commonErrorMessagesMap[error.status]) {
  // 403: 'You do not have a permission to view this data'
  return commonErrorMessagesMap[error.status]
}
```

The axios error has `status` (the response status), so for every 403 the reason of the response is dropped and a generic
message is shown instead. For this action it is also wrong: nothing is viewed, the user tried to add a secret and isn't
told why it was refused.

Evidence (the Playwright trace of MLPS008): the notification text is `You do not have a permission to view this data`; the
response body of `POST /api/v1/projects/cat-vs-dog-classification/secrets` is the `MLRunAccessDeniedError(...)` detail.
(The step reports `Received: null`: the notification hides itself before the 15 s check ends, the last read finds no
element.) With the actual text expected, the rest of the scenario passes (checked on 2026-11-16).

#### Steps to reproduce manually

1. Open a project -> Project settings -> Secrets.
2. Click **Add secret**, type the key `mlrun.something` and the value `value`, apply.
3. Expected: an error notification with the reason from MLRun, `MLRunAccessDeniedError('Not allowed to create/update internal
secrets (key starts with mlrun.)')`.
   Actual: `You do not have a permission to view this data`.

#### Reproduce with the test

```
npx bddgen && npx playwright test --grep "MLPS008 - " --workers=1 --retries=0 --reporter=json
```

(`results[].errors` of the JSON report: the error of an expected failure isn't printed by the line reporter.)

#### Suggested fix

Use the generic 403 message only when the response has no reason, e.g. in `getErrorMsg` check `errorDetail` first:

```js
if (!errorDetail && commonErrorMessagesMap[error.status]) {
  return commonErrorMessagesMap[error.status]
}
```

After the fix MLPS008 passes (reported as "the bug looks fixed"): remove its `@knownBug` tag and move this bug to "Fixed".

### BUG-003 - The breadcrumb of the Quick actions page is the URL segment "quick-actions"

|           |                                                                                                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scenario  | `MLPH001 - Check all mandatory components on Project Home` (`tests/features/quickActions.feature`), step `verify breadcrumbs "tab" label should be equal "Quick actions" value` |
| Where     | `/projects/<project>/quick-actions` (the project's Quick actions page), the last breadcrumb                                                                                     |
| Component | `src/common/Breadcrumbs/breadcrumbs.util.js:46-72` (`generateMlrunScreens`, the extra screens), `src/common/Breadcrumbs/Breadcrumbs.jsx:47-51,63`                               |
| Found     | 2026-11-16, MLPH001 fails at this step on every run (3 of 3)                                                                                                                    |
| Handled   | `@knownBug` (it shows up every time)                                                                                                                                            |

#### What happens

The breadcrumb of the page is the label of its screen, found in `generateMlrunScreens` by the URL segment
(`Breadcrumbs.jsx:47-51`), or the segment itself when no screen is found (`label: screen?.label ?? page`, line 63).
Since the navbar redesign (3110c408, #3701) the screens are the sidebar links (`getLinks`,
`src/nextGenComponents/shared/Sidebar/navbarList.util.jsx`) plus a fixed list of extra screens (Feature sets, Feature
vectors, Features, Alerts, Settings). Quick actions isn't a sidebar link, and it was not added to the extra screens
(before the redesign the list had `{ label: 'Quick actions', id: PROJECT_QUICK_ACTIONS_PAGE, hidden: true }`), so the
breadcrumb shows the raw `quick-actions`.

With the breadcrumb expected as `quick-actions`, the rest of the scenario passes (checked on 2026-11-16, after the page
objects of the page were updated to the header redesign, #3318).

#### Steps to reproduce manually

1. Open `/projects/<any project>/quick-actions`.
2. Expected: the breadcrumbs `Projects > <project> > Quick actions`.
   Actual: `Projects > <project> > quick-actions`.

#### Reproduce with the test

```
npx bddgen && npx playwright test --grep "MLPH001 - " --workers=1 --retries=0 --reporter=json
```

#### Suggested fix

Add the screen to the extra screens of `generateMlrunScreens`:

```js
{
  label: 'Quick actions',
  id: PROJECT_QUICK_ACTIONS_PAGE,
  link: `/${PROJECTS_PAGE_PATH}/${projectName}/${PROJECT_QUICK_ACTIONS_PAGE}`
}
```

After the fix MLPH001 passes: remove its `@knownBug` tag and move this bug to "Fixed".

### BUG-004 - Changing a resource unit in the function panel drops the other half of the resources (requests or limits)

|           |                                                                                                                                                                                                                                                             |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scenario  | `MLF015 - Save new ml-function` and `MLF033 - Verify Resources values on Function Deploy and Run` (`tests/features/MLFunction.feature`), step `verify "Memory_Request_Dropdown" dropdown in "Resources_Accordion" on ... wizard selected option value "MB"` |
| Where     | ML functions -> New function (or Edit) -> Resources: the unit dropdowns of Memory and CPU                                                                                                                                                                   |
| Component | `src/elements/FunctionsPanelResources/FunctionsPanelResources.jsx:298-310` (`handleSelectMemoryUnit`), `:356-367` (`handleSelectCpuUnit`); `src/reducers/functionReducer.js:328-330` (`setNewFunctionResources`)                                            |
| Found     | 2026-11-16, MLF015 and MLF033 fail at this step on every run (3 of 3)                                                                                                                                                                                       |
| Handled   | `@knownBug` (it shows up every time)                                                                                                                                                                                                                        |

#### What happens

`setNewFunctionResources` replaces the whole `spec.resources` of the new function. The value handlers
(`setMemoryValue`, `setCpuValue`, `setGpuValue`) keep the other half (`...functionsStore.newFunction.spec.resources`), the
unit handlers don't:

```js
dispatch(
  setNewFunctionResources({
    [type]: {
      ...functionsStore.newFunction.spec.resources[type],
      cpu: selectedOption.onChange(data[type].cpu)
    }
  })
)
```

So selecting a unit of the limits drops all the requests, selecting a unit of the requests drops all the limits. The
panel still shows the typed values (its own state), but the function is saved/deployed without them. In MLF015 the last unit
selected is the CPU limit one (`millicpu`), the saved function has no requests at all (the body of
`POST /api/v1/projects/default/functions/new-aqa-function-00`, from the trace):

```
typed:  requests: memory 1 MB, cpu 10 millicpu;  limits: memory 1000 KB, cpu 50 millicpu, gpu 15
saved:  "resources": { "limits": { "memory": "1000K", "cpu": "50m", "nvidia.com/gpu": "15" } }
```

(MLF033, deploy: `{ "limits": { "memory": "1000K", "cpu": "7m", "nvidia.com/gpu": "99" } }`, the requests 1 MB / 6 millicpu
are lost.) The Edit panel (MLF015) and the Batch Run wizard (MLF033) then show the default requests of the frontend spec,
`default_function_pod_resources` (`1Mi`, `25m`): the memory request `1` matches by chance, its unit is `MiB` instead of `MB`

- the first check that fails; the CPU request (`25` instead of `10`/`6`) would fail next.

With the unit selects done before the values are typed (each value handler keeps the other half), both scenarios pass to
the end (checked on 2026-11-16): the bug is the only reason they fail.

#### Steps to reproduce manually

1. Open a project -> ML functions -> **New** (with `?demo=false`), name `f1`, Continue.
2. Resources: Memory request `1`, unit **MB**; CPU request `10` millicpu; then change the CPU **limit** unit to **millicpu**.
3. Save, open the function's **Edit**.
4. Expected: Memory request `1` MB, CPU request `10` millicpu.
   Actual: the defaults of the frontend spec (in the mock: `1` MiB, `25` millicpu); the saved function has no `requests`.

#### Reproduce with the test

```
npx bddgen && npx playwright test --grep "(MLF015|MLF033) - " --workers=1 --retries=0 --reporter=json
```

#### Suggested fix

Keep the other half in the unit handlers, as the value handlers do:

```js
setNewFunctionResources({
  ...functionsStore.newFunction.spec.resources,
  [type]: {
    ...functionsStore.newFunction.spec.resources[type],
    cpu: selectedOption.onChange(data[type].cpu)
  }
})
```

(the same in `handleSelectMemoryUnit`). After the fix MLF015 and MLF033 pass: remove their `@knownBug` tags and move this
bug to "Fixed".

### BUG-005 - The "No data" message of Jobs monitoring > Scheduled lists the default filter "Type: all"

|           |                                                                                                                                                                                                                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scenario  | `MLJM003 - Check components on Scheduled tab of Jobs monitoring page` (`tests/features/jobsMonitoring.feature`), step `"Error_Message" component on "Jobs_Monitoring_Scheduled_Tab" should be equal "No_Data_Message"."Common_Message_Jobs_Monitoring_Scheduled" with "auto-generated-data"` |
| Where     | Jobs monitoring -> Scheduled, filter by a project that has no scheduled jobs                                                                                                                                                                                                                 |
| Component | `src/utils/getNoDataMessage.js:231` (`isTypeVisible`), `src/utils/jobs.util.jsx:260` (the initial value of the Scheduled Type filter), `src/components/Jobs/ScheduledJobs/ScheduledJobsFilters.jsx:39` (`MultiSelectFilter`)                                                                 |
| Found     | 2026-11-16, MLJM003 fails at this step on every run (2 of 2 in the regression)                                                                                                                                                                                                               |
| Handled   | `@knownBug` (it shows up every time)                                                                                                                                                                                                                                                         |

#### What happens

The app hides the filters that have the default value from the "No data" message. The Type filter of the Scheduled tab is
a multi-select, its initial value is the array `[FILTER_ALL_ITEMS]` (`jobs.util.jsx:260`), but `getNoDataMessage` compares
it with the string:

```js
const isTypeVisible = type === TYPE_FILTER && !isEqual(filters[TYPE_FILTER], FILTER_ALL_ITEMS)
```

`isEqual(['all'], 'all')` is false, so the default Type is shown. The Status filter, also a list, is compared correctly
with `[FILTER_ALL_ITEMS]` a few lines above (`isStatusVisible`). The other Jobs tabs have `FILTER_ALL_ITEMS` (a string) as
the initial Type (`jobs.util.jsx:214`), they are not affected.

#### Evidence

```
Received string: "No data matches the filter: \"Scheduled at: Nov 16, 2026, 12:43:46 PM - Nov 17, 2026, 12:43:46 PM, Project: auto-generated-data, Type: all\""
```

The regression of 2026-11-16 failed 2 of 2 attempts with it. The old `(.+?)` wildcard in the expected message had matched
`auto-generated-data, Type: all` as the project name, which hid the bug; the expected message (no "Type: all") is right.

#### Steps to reproduce manually

1. Open Jobs monitoring -> Scheduled.
2. Filter by a project that has no scheduled jobs (e.g. `auto-generated-data`), leave Type as is (All).
3. Expected: `No data matches the filter: "Scheduled at: <from> - <to>, Project: auto-generated-data"`.
   Actual: the same with `, Type: all` at the end.

#### Reproduce with the test

```
npx bddgen && npx playwright test --grep "MLJM003 - " --workers=1 --retries=0 --reporter=json
```

#### Suggested fix

Compare with both forms of the default value:

```js
const isTypeVisible =
  type === TYPE_FILTER &&
  ![FILTER_ALL_ITEMS, [FILTER_ALL_ITEMS]].some(value => isEqual(filters[TYPE_FILTER], value))
```

After the fix MLJM003 passes (reported as "the bug looks fixed"): remove its `@knownBug` tag and the BUG-005 comment, and
move this bug to "Fixed".

## Fixed

(none yet)
