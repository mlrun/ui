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
const fs = require('fs')
const acorn = require('acorn')

const testStepsFolder = './tests/features/step-definitions/'

const fileArr = fs.readdirSync(testStepsFolder)

const regexp = new RegExp('{[a-z]*}*', 'g')

let stepArrays = []

for (let item of fileArr) {
  try {
    const txt = fs.readFileSync(`${testStepsFolder}${item}`, 'utf8')
    const tmp = acorn.parse(txt, {
      ecmaVersion: 2020,
      sourceType: 'module'
    })
    stepArrays.push(
      tmp.body
        .filter(item => item.type === 'ExpressionStatement')
        .map(item => {
          let indexes = []
          let match

          const action = item.expression.callee.name
          let statement = item.expression.arguments[0].value
          let keyWords = item.expression.arguments[1].params.map(
            name => name.name
          )

          while ((match = regexp.exec(statement)) !== null) {
            indexes.push([match.index, regexp.lastIndex])
          }

          for (let i = indexes.length - 1; i >= 0; i--) {
            statement = `${statement.slice(0, indexes[i][0])}"${
              keyWords[i]
            }"${statement.slice(indexes[i][1])}`

            if (keyWords.length > indexes.length) {
              statement += ` [${keyWords.pop()}]`
            }
          }

          return `${action} ${statement}`
        })
    )
  } catch (err) {
    console.error(err)
  }
}

console.log('')
for (let item of stepArrays.flat()) {
  console.log(item)
}
