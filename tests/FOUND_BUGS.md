# App bugs found by the E2E regression run

Real app bugs found while fixing the failed (`@rerun`) regression scenarios.
The scenarios below are left as they are: they fail until the bug is fixed in the app.

## Confirmed

### 1. Quick actions breadcrumb shows the raw page slug

- **Scenario:** `quickActions.feature` MLPH001
- **Steps:** open any project → go to `/projects/<project>/quick-actions`.
- **Expected:** the last breadcrumb is "Quick actions".
- **Actual:** the last breadcrumb is "quick-actions".
- **Cause:** `src/common/Breadcrumbs/breadcrumbs.util.js` `generateMlrunScreens` builds the screen list from
  `src/nextGenComponents/shared/Sidebar/navbarList.util.jsx` `getLinks`, which has no quick actions entry.
  The old `src/layout/Navbar/navbar.util.jsx` had `{ id: PROJECT_QUICK_ACTIONS_PAGE, label: 'Quick actions' }`.
  Regression of the sidebar migration.

### 2. Model "LLM Prompts" tab never shows "No data" / the request error

- **Scenario:** `models.feature` MLM042
- **Steps:** open a model that has children whose LLM prompts request returns an empty list (or fails) → open the "LLM Prompts" tab.
- **Expected:** the "No data" message (or the error).
- **Actual:** an empty area without table header or message.
- **Cause:** `src/components/DetailsLLMPrompts/DetailsLLMPrompts.jsx:84` checks `llmPromptsArtifacts.length === 0`,
  but `llmPromptsArtifacts` is `{ data, loading }`, so `.length` is always `undefined`.
  Should be `llmPromptsArtifacts.data.length === 0`.

### 3. Backend 403 error detail is replaced by a generic, misleading message (low)

- **Scenario:** `projectSettings.feature` MLPS008 (`@inProgress`)
- **Steps:** project settings → Secrets → add a key named `mlrun.something`.
- **Expected:** the backend detail: `MLRunAccessDeniedError('Not allowed to create/update internal secrets…')`.
- **Actual:** "You do not have a permission to view this data" ("view" for a write action).
- **Cause:** `dashboard-react-controls` `utils/common.util.js` `getErrorMsg` uses `commonErrorMessagesMap[403]` even when the response has a detail.

## Suspected (need a manual repro)

### 4. Chip (label) editing closes and drops an incomplete label

- **Scenario:** `projectSettings.feature` MLPS002
- **Steps:** project settings → Labels → "+" → type an invalid key, clear it, type `/` in the value, then a 63 characters value.
- **Expected:** the chip stays in edit mode with the validation rules shown.
- **Actual (suspected):** edit mode closes and the chip is removed.
- **Suspected cause:** `NewChipForm` registers a capture-phase `window` `scroll` listener while the validation rules are shown;
  `handleScroll` calls `outsideClick(event, true)`, so any scroll (including the input's own horizontal scroll while typing a long value)
  exits edit mode, and `FormChipCell.handleEditChip` removes the chip with an empty key.
  Also "Maximum update depth exceeded" React warnings appear in every labels editing form.

### 5. ML functions list can stay empty after quickly changing the date filter

- **Scenarios:** `MLFunction.feature` MLF031, MLF032, MLF034 (flaky)
- **Steps:** project → ML functions → right after the page opens switch the date filter to "Any time"; repeat a few times.
- **Expected:** the functions list.
- **Actual (suspected):** "No data matches the filter" until refresh.
- **Suspected cause:** `src/components/FunctionsPageOld/FunctionsOld.jsx` `fetchData` creates a new `AbortController`
  without aborting the previous request, and the shared `functionsStore.loading` flag is reset by whichever request finishes first.

### 6. No message when the function of a run/schedule doesn't exist (UX)

- **Steps:** Batch re-run of a job, "Edit" of a schedule, or click on a schedule name, when the job's function returns 404.
- **Expected:** an error like on the Jobs page ("This function either does not exist or was deleted").
- **Actual:** nothing happens; "Edit" opens an empty wizard with disabled steps.
