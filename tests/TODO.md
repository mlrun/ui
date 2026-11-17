# E2E tests: open questions and follow-ups

To discuss and decide. Each item says what was found, why it matters and the options.

## Decisions about the accuracy of the checks

### 1. The lists are compared in order

Done: the tab, header and option lists (`verify "X" on "Y" wizard should contain "Consts"."List"`, the dropdown and
combobox `... should contain "Consts"."List"`) must have exactly the expected items in the expected order
(`expectListItems` in `tests/features/common-tools/element.js`). A mismatch prints the actual list in the app's order
as a JS array literal, ready to be pasted into `common-consts.js`.

- Exempt (`unordered(...)` in `common-consts.js`, compared as before, with a comment why): the order isn't fixed by the
  app - `Tag_Filter_Options_Feature_Sets_Default`, `Tag_Filter_Options_Feature_Vectors_Default` (the tags of the shown
  rows, then the other ones, each in the API order, FormTagFilter), `Pods_Priority`, `Pods_Priority_List` (the
  backend's `valid_function_priority_class_names` in its order).
- Fixed to the app's order (checked in `src/`, the ones in a run confirmed by it): `Overview_Producer_Headers` of
  datasets and models (`producerListOrder`: "UID" before "Workflow"), `Job_Overview_Action_Menu_Options`,
  `Hyperparameter_Strategy_Options`, `Tag_Filter_Options` ("latest" first).
- Kept ordered, though partly data-driven: the pipeline step headers (`Real_Time_Pipeline_Pane.Overview_Headers_*`: the
  tail is the key order of the step in the API response, the mock fixes it).

Open: the next full run shows the lists whose order still differs (most were compared with `src/` only).

### 2. The variable parts of the expected messages

Done: the "should be equal" patterns of `common-consts.js` have no `(.+?)` anymore. Their capturing groups are the
variable parts, filled from the scenario by the new variants `... should be equal "C"."M" with "v1"` (`with "v1" and
"v2"`, `with "v1", "v2" and "v3"`; `fillPatternGroups` in `common.action.js`): 41 of the 66 uses give the values (job,
workflow, function, project, feature vector names, the filter values, the artifact kind). The rest is narrowed: a name
`[^"]+`, a run UID `[0-9a-f]{32}`, the dates to the date format, "Show best iteration only: true"; the
`Info_Banner_Message` of files and models is the exact text ("artifact", "model"); the kind repeated in
`Register_Error_Message`/`Add_A_Tag_Overwrite_Message` is a backreference.

Open: the uses without values (the item opened by a row index: MLF009, MLFS044, MLFS061 2nd/3rd, MLJW061 info pane,
MLJW089 info pane, the workflow panes of MLJW*, the info banners) check only the narrowed pattern.

### 3. "contains" steps that are used as "equals"

Done: exact variants, the listed lines are switched to them:

- `... should be equal {string} attribute value` (the 4 Version_Tag checks of MLM024);
- `verify {string} on {string} wizard should be equal {string} value` (`models.feature` MLM020 x2,
  `jobsAndWorkflows.feature` MLJW051);
- `check {string} exact header value in {string} column ...` (all 46 uses of the header check).

Open: `... should contain ... attribute value` is still used for `Table_Label_Filter_Input` (monitoringApp) and
`Default_Artifact_Path_Input` (projectMonitoring, quickActions), probably meant as equality too - not run.

### 4. Low-confidence findings

Done:

- the notification text (`"Notification_Popup" element on "Notification_Popup" should contain ...`, also the
  `within N seconds` variant): any shown notification with the text, except the ones matched by the previous checks (marked in the DOM,
  `verifyNotificationText`). Not the newest one: a notification followed by another one at once is checked too
  (MLPr006: "Project deletion in progress", then "... was deleted successfully"). The `within N seconds` variant is a
  wait, it doesn't mark (the scenarios check the same notification right after it);
- `componentIsNotVisible`: none of the matched elements may be displayed;
- "collapsed": also the accordion container is not `open` and its content is cut off;
- the action menu checks (`verify options in action menu ...`, `verify action menu ...`): the row is checked to be
  still at its index after the options are read, otherwise it is found again;
- the rules check: the field must have the typed invalid string (cut only by its `maxlength`).

Open: the rules parser (the prefix rules, "This field is required", "Max length between two periods" taken for the
length rule) - not changed.

## Next steps

### 5. Defect injection: prove that the checks catch a broken app

Done: `npm run test:defects` (`scripts/testDefects.js`, the defects in `tests/mockServer/defects.js`, README). 8
defects, 9 scenarios, all caught: a missing dataset source (MLD003), wrong datasets/alerts counters (MLPr021, MLPr020), a
wrong schedule label (MLJW010), the functions name filter and the runs status filter ignored (MLF006, MLJW011), a failed
function deletion (MLF017, MLJW030), an abort that never ends (MLJW049).

Open:

- more defects, a few per feature file (models, feature store, alerts, the wizards: the submitted request body);
- run it on CI (nightly)? ~3 minutes now.
- the mock filters the schedules by `labels`, the UI shows `scheduled_object.task.metadata.labels`: the two differ for
  no reason, a label filter scenario can pass on a schedule whose shown labels don't match.

### 6. The fixed waits in the feature files

Done: the 13 `wait for N seconds` steps are replaced (~4 minutes less per run):

- MLPr019 (4 x 47 s, the "MLRun seems to be down" popup after 3 minutes of failed retries): the browser clock is fake
  (`page.clock`, the `@mlrunUnhealthyTest` hook), `move the browser time forward by N seconds`. It checks now that the
  popup isn't shown before the 3 minutes too. ~3 s instead of ~190 s;
- MLF017, MLJW030 (the function deletion, 3.6-10.6 s in the mock):
  `... should contain "..." value within 20 seconds`;
- MLJW049 (abort): waits for the "was aborted" notification instead of 5 s;
- the rest (a notification, a refreshed table) are covered by the waits of the next steps (15 s).

`wait for {int} seconds` is not used anymore, it is left for the debugging.

### 7. One mock server and one app for all the workers

Done (2026-11-16): `E2E_WORKERS=N` is one `playwright test --workers N` (`fullyParallel`: the scenarios, not the
feature files, are spread over the workers), one app server, one mock server, one console reporter
(`tests/reporters/console-reporter.js`, the worker label `wN` on every line), one Allure report.
`E2E_FULL_PER_WORKER=true` is `--repeat-each N`. The shard processes, their port pairs and the event merging are gone.

- the mock server (`scripts/mockServer.js`) is a front: every request carries `x-e2e-worker` (the Playwright
  `parallelIndex`: the browser through `extraHTTPHeaders`, `world.js`; the API steps and the mock control requests
  through `workerHeaders()`, `tests/config.js`), the front passes it to the instance of that worker. An instance is
  `mock.js` in its own worker thread (its own module graph: the data, timers, background tasks, `failAllRequests`),
  listening on a free port of 127.0.0.1. The reset terminates the thread of the worker and starts a new one, the answer
  comes once it listens. A crash of an instance fails only its worker's requests (502) until its next reset;
- `MOCK_STRICT_WORKERS=true` (playwright.config.js, `test:defects`): a request without the header is refused (400). A
  mock server started by hand serves it from the instance of worker 0;
- `npm run test:mock-isolation` (`scripts/testMockIsolation.js`): two workers at once, no browser - a project, a reset,
  the failure condition and the generated data of one worker are not seen by the other, a request without the header is
  refused, the memory stays flat over the resets;
- a direct `playwright test --workers N` takes the lock as a parallel run too (`global-setup.js`).

Memory (measured on a busy machine, single-worker runs): before, per worker a mock server ~160 MB (the supervisor 48 MB
and the instance process ~111 MB) and an app server ~180 MB (+ the npm/npx wrappers ~165 MB); now one mock server ~65
MB + ~65 MB per instance (~195 MB with 2) and one app server for all the workers. The rest per worker (a Playwright
worker process ~450 MB, a browser ~300-600 MB) is unchanged.

Open:

- the first parallel run (not run here: the parallel runs are started by a person) - a scenario that depends on
  another one shows up as a failure only with the scenarios spread over the workers;
- the start of an instance is mostly the loading of `mock.js`'s modules, `lodash-es` above all (its whole barrel, ~650
  files): seconds on a busy machine. The imports per function would cut it by about two thirds.

### 8. The known bugs without an entry in KNOWN_BUGS.md

Done (2026-11-16). Each of them was run 3+ times, it failed at the same step every time:

- MLPS008 - BUG-002 (a 403 shows "You do not have a permission to view this data" instead of the reason), `@knownBug`;
- MLPH001 - BUG-003 (the breadcrumb of the Quick actions page is "quick-actions"), `@knownBug`. It hid a second, test
  side problem: the page objects of the page were outdated since the header redesign (#3318) - no project description,
  no "more actions" button, the name is the page title. Updated (`demoProject`, `project.po.js`), the rest passes;
- MLF015, MLF033 - BUG-004 (a unit select in the function Resources drops the requests or the limits), `@knownBug`;
- MLFS056 (`@FAILED_TODO`, not `@knownBug`) - not an app bug: its project was never created (the precondition was
  commented out), the data source wasn't set (no Edit/Apply), a wrong warning step, and the mock had no ingest endpoint.
  Fixed (the mock starts the `<feature set>-ingest` run), the tag removed, the title fixed (it didn't check labels).

For each kept tag it was checked that the scenario passes to the end with the bug worked around, so the bug is the only
reason it fails.

Done: a text check of a notification that hides itself reported `Received: null` instead of the wrong text (MLPS008).
`pollText` (`tests/features/common-tools/element.js`) keeps the last text read and adds it to the error:
`(the last text read before the element was gone: "...")`.

### 9. The Selenium leftovers cleanup

Done in the JS (2026-11-16), no change in what a scenario checks. Each batch was verified with its scenarios:

- dead step definitions: the 35 with 0 matching feature lines (the Cucumber expressions matched as regexes against
  every step line, not as substrings), e.g. `verify filled data in`, the subtable "should contains",
  `check ... not visible in`, `expand each row`, both context value steps (`values from`, with and without `split`),
  `create ... Schedule`/`File`. Then the 14 helpers only they used (e.g. `settleTimeout`, `createAPISchedule`,
  `deleteAPISchedule`, `openActionMenuByIndex`, `get*Geometry`), the relative range branch of `verifyTimeFilterBand`,
  the `schedule`/`file` tear-down kinds and the imports. Kept: `wait for {int} seconds` (debugging, item 6);
- Knip: the entries are `tests/features/step-definitions/*.js` and `tests/features/support/*.js` (it was
  `tests/features/**/*.js`, which hid every dead export). `npm run knip` is clean; `expectTimeout`, the same value as
  `actionTimeout` under its own name, is ignored as a duplicate export;
- dead page objects and consts: the `Create_Job` wizard (`CreateJob` and its tables), 76 entries whose name is in no
  feature file and no JS (the HEAD version of the features included), the selectors only they used, and 42 consts
  (the `Create_New_Job` and `Jobs_Monitor_Tab` groups and 40 entries, by `"Group"."Entry"`: every consts read goes
  through it);
- `waiteUntilComponent` renamed `waitForComponentAttached` (12 calls). All are kept: it waits up to 60 s, the check
  after it 15 s, also the one followed by `componentIsPresent` (`verify if ... popup dialog appears`);
- `scrollToWebElement` merged into `scrollToElement` (a selector or a locator); the broken `npm run ui-steps`
  (`scripts/collectUITestsSteps.js`) and the `acorn` devDependency removed; the comments that described the semantics
  as "WebDriver"/"Cucumber" reworded; the stale "Changes Log ... demo=true" comment removed.

Left:

- batch 4: the removal of the logo hover;
- decide about the unused tags and the double page load;
- `{string} element on {string} should contain {string} attribute value` has 0 uses now (MLMA007 moved to
  `should be equal`): kept while the feature files are being changed, remove it if it stays unused;
- the page object entries are dead by their name across all the wizards: an entry whose name is used with another
  wizard only is still there (a check per wizard would find more).

The naming pass (batch 7, done 2026-11-16): renames only, every feature step line matches the same definition as
before (the Cucumber expressions as anchored regexes, the step line count per feature file unchanged), 39 scenarios of
the 16 feature files passed (MLPS008 failed as its known bug):

- step texts (32 definitions, ~1830 feature lines): `should contains` -> `should contain` (20 definitions, 1649 lines),
  `element not exists` -> `element does not exist` (2, 117), `increase/decrease value on N points` -> `by N points`
  (6, 48), `check ... not presented in` -> `not present in` (13), `file is existed on` -> `file exists on`,
  `without inputgroup` -> `without input group`, `with notification pop-up` -> `with notification popup`;
- "Popup": the wizards `Schedule_PopUp`, `MLRun_Unhealthy_PopUp`, the page object entries `Notification_Pop_Up`
  (`Notification_Popup` now, the same name as its wizard, as `Add_Tag_Popup` and `Delete_Artifact_Popup` already
  are), `Notification_Pop_Up_Cross_Close_Button`, `Download_Pop_Up*`, `Header_Download_Pop_Up`,
  `Job_Detail_PopUp_Link`, `Dialog_PopUp`, `Passthrough_PopUp_Dialog` and the JS keys `notificationPopUp`,
  `downloadsPopUp`, `mLRunUnhealthyPopUp`, `schedulePopUp`;
- misspelled identifiers: `Tag_Filer_Options*` -> `Tag_Filter_Options*`, `Tabel_View_Button`/`tabelViewButton`/
  `tabelCell`, `Common_Tolltip`, `Failed_Worflows`, `Volume_Paths_Table_Claime_Name_Input`, `tableCulumnNames`,
  `DeploymetActionsTable`/`DeploymetLinksTable`; typos in comments (`table.component.js`, a Cyrillic "с" in
  `graph.action.js`);
- `commonPagesHeader.po.js` -> `common-pages-header.po.js` (the wizard keeps its name `commonPagesHeader`);
- `utils.js`: the "no one knows what the rule means" note replaced by what the app does (`maxLengthBetweenDelimiters`:
  split by `.`, `-` and `_`, every part 1..63 characters).

Not renamed: the scenario titles (Allure history: "highlited", "Piplines", "pop-up"), the CSS selectors and app texts
(`pop-up-dialog`, `datepicker__pop-up`, `alt="MLRUN on Gihub"`, `'wrere'` - a typed test value), the typed data
(`sectretKey1`, `happines`, `obryv`...), `check` vs `verify` and `component` vs `element` in the step texts (not worth
the churn), `should be equal {string}` (no "to"), `nontable inputs`, `into` in the searchable-fragment steps, `indx`,
the casing of `mLRunUnhealthyPopup` and of the wizard `commonPagesHeader`.

Done in the feature files: removed 120 redundant `wait load page` lines (78 after another `wait load page`, 42 after `navigate back`/`navigate forward`/`refresh a page`, which wait themselves) and the no-op `turn Off MLRun CE mode` step (2 uses + its definition; the Before hook sets `igzFullVersion`), and MLMA007 checks the whole label filter value (`should be equal ... attribute value`). Left: the `Default_Artifact_Path_Input` substring checks (projectMonitoring, quickActions): there is no exact variant of the `element in {string} on {string}` step, and with the mock data the field likely holds `JOB_DEFAULT_OUTPUT_PATH` (`.../artifacts/{{run.uid}}`), so the expected value is a prefix, not the whole value.
