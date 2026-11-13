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

## Fixed

(none yet)
