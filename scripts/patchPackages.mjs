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

// Runs on `postinstall`. Patches installed packages in place, without extra dependencies.
//
// react-final-form 7.0.1: on mount, `useField` calls `form.change(name, initialValue)` when the field
// is not registered yet. A field that unmounts and mounts again (details edit mode, editable table rows,
// pop-ups) therefore loses the value kept in the form. react-final-form 6 kept that value.
// The patch restores the v6 behavior: the initial value is re-applied only when the value was destroyed
// on unregister (`destroyOnUnregister`), and the first render shows the value kept in the form (also its
// `length`, so a FieldArray renders its rows in the first commit as in v6, not one commit later).
//
// When react-final-form is upgraded, check whether the issue is fixed upstream and update or remove this patch.
import fs from 'node:fs'
import path from 'node:path'

const MARKER = 'mlrun-ui patch'

const patches = [
  {
    packageName: 'react-final-form',
    version: '7.0.1',
    files: {
      'dist/react-final-form.es.js': 'getIn',
      'dist/react-final-form.cjs.js': 'finalForm.getIn'
    },
    getReplacements: getIn => [
      [
        `      if ((component === "select" || type === "select") && multiple && initialStateValue === undefined) {
        initialStateValue = [];
      }
`,
        `      if ((component === "select" || type === "select") && multiple && initialStateValue === undefined) {
        initialStateValue = [];
      }

      // ${MARKER}: start from the value kept in the form (e.g. a remounted field), as in v6
      var formValue = formState.values ? ${getIn}(formState.values, name) : undefined;
`
      ],
      [
        `        length: undefined,
`,
        `        length: Array.isArray(formValue) ? formValue.length : undefined, // ${MARKER}
`
      ],
      [
        `        value: initialStateValue,
`,
        `        value: formValue !== undefined ? formValue : initialStateValue,
`
      ],
      [
        `    if (!existingFieldState) {
`,
        `    // ${MARKER}: only re-apply the initial value when the value was destroyed on unregister.
    // Otherwise a remounted field would overwrite the value kept in the form with its initial value.
    if (!existingFieldState && form.destroyOnUnregister) {
`
      ]
    ]
  }
]

const nodeModulesPath = path.resolve(import.meta.dirname, '../node_modules')

patches.forEach(({ packageName, version, files, getReplacements }) => {
  const packagePath = path.join(nodeModulesPath, packageName)

  if (!fs.existsSync(packagePath)) {
    return
  }

  const installedVersion = JSON.parse(
    fs.readFileSync(path.join(packagePath, 'package.json'), 'utf8')
  ).version

  if (installedVersion !== version) {
    throw new Error(
      `[patchPackages] ${packageName} ${installedVersion} is installed, the patch targets ${version}. ` +
        'Check whether the issue is fixed upstream and update or remove the patch in scripts/patchPackages.mjs.'
    )
  }

  Object.entries(files).forEach(([file, getIn]) => {
    const filePath = path.join(packagePath, file)
    let content = fs.readFileSync(filePath, 'utf8')

    const originalContent = content

    getReplacements(getIn).forEach(([search, replacement]) => {
      // already applied (e.g. postinstall runs again on an installed package)
      if (content.includes(replacement)) {
        return
      }

      if (content.split(search).length !== 2) {
        throw new Error(
          `[patchPackages] ${packageName}/${file}: patch target not found or not unique`
        )
      }

      content = content.replace(search, replacement)
    })

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content)
      console.log(`[patchPackages] patched ${packageName}/${file}`)
    }
  })
})
