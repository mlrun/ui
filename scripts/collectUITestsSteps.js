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
