# App bugs found by the E2E regression run

Real app bugs found while fixing the failed (`@rerun`) regression scenarios.
The scenarios below are left as they are: they fail until the bug is fixed in the app.

## Confirmed

### 1. Broken links loop forever instead of redirecting (react-router 7)

- **Scenarios:** `models.feature` MLM032, `MLFunction.feature` MLF032 (last step)
- **Steps:** open `/projects/default/models/INVALID` (or any unknown URL, e.g. `/projects/default/INVALID/x/latest/overview`).
- **Expected:** redirect to `/projects/default/models/models` (resp. `/projects`).
- **Actual:** the URL keeps growing: `/projects/default/models/INVALID/models/models/models/...` until Chrome logs
  "Throttling navigation to prevent the browser from hanging".
- **Cause:** `react-router-dom` bump 6.30.4 → 7.18.4 (93d4f977). In v7 a relative `to` inside a splat (`*`) route is resolved
  against the full matched URL (former `v7_relativeSplatPath`, now always on), so `Navigate to="models"` from `.../models/INVALID`
  goes to `.../models/INVALID/models`, which matches `*` again. Affected catch-alls in `src/App.jsx`:
  `:402` `<Navigate to={MODELS_TAB} replace />` (models/\*), `:375` `FEATURE_SETS_TAB` (feature-store/\*),
  `:315` `MONITOR_JOBS_TAB` (jobs/\*, also `replace` is set on `<Route>` instead of `<Navigate>`),
  `:244` `JOBS_MONITORING_JOBS_TAB` (projects/\*/jobs-monitoring/\*), `:470` `<Navigate replace to="projects" />` (top-level `*`).
- **Fix:** `to={`../${MODELS_TAB}`}` (same for the other nested ones) and `to="/projects"` for the top-level one.

### 2. Function resources: selecting a memory/CPU unit drops the other resources group (requests/limits)

- **Scenarios:** `MLFunction.feature` MLF015, MLF033
- **Steps:** ML functions → New → Resources: memory request `1` + "MB", memory limit `1000` + "KB", CPU request "millicpu" `10`,
  CPU limit "millicpu" `50` → Save (or Deploy) → edit the function (or Batch run → select it → Resources).
- **Expected:** memory request 1 MB, CPU request 10 millicpu.
- **Actual:** the requests are back to the defaults (1 MiB, 25 millicpu), only the limits are saved.
- **Cause:** `src/reducers/functionReducer.js:328` `setNewFunctionResources` replaces the object
  (`state.newFunction.spec.resources = action.payload`), but `src/elements/FunctionsPanelResources/FunctionsPanelResources.jsx`
  `handleSelectMemoryUnit` (`:300`) and `handleSelectCpuUnit` dispatch only `{ [type]: {...} }`, so a unit change of `limits`
  removes `requests` and vice versa. Regression of the RTK migration 6bd117e1 (#3182): the old reducer merged
  (`resources: { ...state.newFunction.spec.resources, ...payload }`).

### 3. Batch (re-)run resets the Jobs list filters

- **Scenario:** `jobsMonitoring.feature` MLJM011
- **Steps:** Jobs monitoring → Jobs tab → set the date filter to "Any time" (or any non-default filter) → row action "Batch re-run" → Run.
- **Expected:** the filters stay as they were ("Any time").
- **Actual:** the date picker shows the default "Past 24 hours", while the table still shows the "Any time" results (e.g. 2021 runs).
- **Cause:** `src/components/JobWizard/JobWizard.jsx:341` `runJobHandler` refreshes the jobs with the current filters
  (`onSuccessRequest`) and then calls `navigate('/projects/*/jobs-monitoring/jobs')` (or `/projects/<project>/jobs/monitor-jobs`)
  without the current search params, so `useFiltersFromSearchParams` falls back to the defaults. Introduced in a69487c5 (#3385).

### 4. "Create feature vector" Labels: the "+" button disappears once the chips fill the line

- **Scenario:** `featureStore.feature` MLFS039
- **Steps:** project → Feature store → Feature vectors → "Create vector" → add labels `key1:value1` … `key4:value4`, try to add a 5th one.
- **Expected:** the chips wrap to a new line and "+" (add label) stays available.
- **Actual:** "+" is clipped outside the Labels field, no more labels can be added.
- **Cause:** `src/elements/CreateFeatureVectorPopUp/CreateFeatureVectorPopUp.jsx:131` `FormChipCell` has no `visibleChipsMaxLength="all"`,
  so the DRC `.chips-wrapper` stays `flex-flow: row; overflow: hidden`. Same issue as fixed for "Create new project"
  in #3770 (fbb9d13d, ML-13078) — the fix is the same one-line prop.

### 5. Quick actions breadcrumb shows the raw page slug

- **Scenario:** `quickActions.feature` MLPH001
- **Steps:** open any project → go to `/projects/<project>/quick-actions`.
- **Expected:** the last breadcrumb is "Quick actions".
- **Actual:** the last breadcrumb is "quick-actions".
- **Cause:** `src/common/Breadcrumbs/breadcrumbs.util.js` `generateMlrunScreens` builds the screen list from
  `src/nextGenComponents/shared/Sidebar/navbarList.util.jsx` `getLinks`, which has no quick actions entry.
  The old `src/layout/Navbar/navbar.util.jsx` had `{ id: PROJECT_QUICK_ACTIONS_PAGE, label: 'Quick actions' }`.
  Regression of the sidebar migration.

### 6. Model "LLM Prompts" tab never shows "No data" / the request error

- **Scenario:** `models.feature` MLM042
- **Steps:** open a model that has children whose LLM prompts request returns an empty list (or fails) → open the "LLM Prompts" tab.
- **Expected:** the "No data" message (or the error).
- **Actual:** an empty area without table header or message.
- **Cause:** `src/components/DetailsLLMPrompts/DetailsLLMPrompts.jsx:84` checks `llmPromptsArtifacts.length === 0`,
  but `llmPromptsArtifacts` is `{ data, loading }`, so `.length` is always `undefined`.
  Should be `llmPromptsArtifacts.data.length === 0`.

### 7. Backend 403 error detail is replaced by a generic, misleading message (low)

- **Scenario:** `projectSettings.feature` MLPS008 (`@inProgress`)
- **Steps:** project settings → Secrets → add a key named `mlrun.something`.
- **Expected:** the backend detail: `MLRunAccessDeniedError('Not allowed to create/update internal secrets…')`.
- **Actual:** "You do not have a permission to view this data" ("view" for a write action).
- **Cause:** `dashboard-react-controls` `utils/common.util.js` `getErrorMsg` uses `commonErrorMessagesMap[403]` even when the response has a detail.

## Suspected (need a manual repro)

### 8. Chip (label) editing closes and drops an incomplete label

- **Scenario:** `projectSettings.feature` MLPS002
- **Steps:** project settings → Labels → "+" → type an invalid key, clear it, type `/` in the value, then a 63 characters value.
- **Expected:** the chip stays in edit mode with the validation rules shown.
- **Actual (suspected):** edit mode closes and the chip is removed.
- **Suspected cause:** `NewChipForm` registers a capture-phase `window` `scroll` listener while the validation rules are shown;
  `handleScroll` calls `outsideClick(event, true)`, so any scroll (including the input's own horizontal scroll while typing a long value)
  exits edit mode, and `FormChipCell.handleEditChip` removes the chip with an empty key.
  Also "Maximum update depth exceeded" React warnings appear in every labels editing form.
  Not confirmed by the latest run (the scenario failed before the chips steps); note that test helpers scrolling elements
  into view can trigger the same `scroll` listener.

### 9. ML functions list can stay empty after quickly changing the date filter

- **Scenarios:** `MLFunction.feature` MLF031, MLF032, MLF034 (flaky)
- **Steps:** project → ML functions → right after the page opens switch the date filter to "Any time"; repeat a few times.
- **Expected:** the functions list.
- **Actual (suspected):** "No data matches the filter" until refresh.
- **Suspected cause:** `src/components/FunctionsPageOld/FunctionsOld.jsx` `fetchData` creates a new `AbortController`
  without aborting the previous request, and the shared `functionsStore.loading` flag is reset by whichever request finishes first.

### 10. No message when the function of a run/schedule doesn't exist (UX)

- **Steps:** Batch re-run of a job, "Edit" of a schedule, or click on a schedule name, when the job's function returns 404.
- **Expected:** an error like on the Jobs page ("This function either does not exist or was deleted").
- **Actual:** nothing happens; "Edit" opens an empty wizard with disabled steps.
