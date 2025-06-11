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
import { By } from 'selenium-webdriver'
import { locatorBuilder } from '../../common-tools/common-tools'

/**
 * Componet for accessing to any periodical component on page like simple table
 * @param {object} tableStructure - js object that should contain page locators for
 *    buildin table object:
 * js object sctucture:
 * {
 *    root: <string>, - root locator to perioddical part in DOM
 *    header: {
 *        root: <string> - subroot locator to header of table
 *        sorters: {
 *            name1: <string> - sublocator for access to table column sorter
 *            ...
 *            nameN:
 *        }
 *    },
 *    body{
 *        ofsset: <int>, - index of real dataline start
 *        add_row_btn: <string>, - button for creating new row
 *        root: <string>, - subroot locator to body of table
 *        row: {
 *            root: <string> - subroot locator to row of table which used with idex
 *            fields: {
 *                name1: <string> - sublocator for access to table column cell
 *                ...
 *                nameN:
 *            }
 *        },
 *    }
 * }
 * @returns - js object which allow access to table describle page components
 */
export default function(tableStructure) {
  const table = tableStructure
  const sortersBuilder = locatorBuilder`${0} ${1} ${2}`
  const columnBuilder = locatorBuilder`${0} ${1} ${2} ${3}`
  const rowBuilder = locatorBuilder`${0} ${1} ${2}:nth-of-type(${3})`
  const fieldBuilder = locatorBuilder`${0} ${1} ${2}:nth-of-type(${3}) ${4}`
  const sorters = {}
  const columnSelector = {}
  const fieldSelector = {}
  const offset = table.body.offset ? parseInt(table.body.offset) : 0

  const root = By.css(table.root)
  for (const key in table.header.sorters) {
    sorters[key] = By.css(
      sortersBuilder(table.root, table.header.root, table.header.sorters[key])
    )
  }

  const row = index =>
    By.css(
      rowBuilder(
        table.root,
        table.body.root,
        table.body.row.root,
        offset + parseInt(index)
      )
    )

  for (const key in table.body.row.fields) {
    // TO DO: initialization of nested page components should be improoved in feature
    if (typeof table.body.row.fields[key] !== 'string') {
      const subRoot = columnBuilder(
        table.root,
        table.body.root,
        table.body.row.root,
        table.body.row.fields[key].structure.root
      )
      columnSelector[key] = By.css(subRoot)

      const subComponent = { ...table.body.row.fields[key].structure }
      fieldSelector[key] = index => {
        subComponent.root = fieldBuilder(
          table.root,
          table.body.root,
          table.body.row.root,
          offset + parseInt(index),
          table.body.row.fields[key].structure.root
        )
        return table.body.row.fields[key].componentType(subComponent)
      }
    } else {
      columnSelector[key] = By.css(
        columnBuilder(
          table.root,
          table.body.root,
          table.body.row.root,
          table.body.row.fields[key]
        )
      )
      fieldSelector[key] = index =>
        By.css(
          fieldBuilder(
            table.root,
            table.body.root,
            table.body.row.root,
            offset + parseInt(index),
            table.body.row.fields[key]
          )
        )
    }
  }

  const resultTable = {
    root: root,
    headerSorters: sorters,
    offset: offset,
    rowRoot: row,
    tableColumns: columnSelector,
    tableFields: fieldSelector,
    tableCulumnNames: Object.keys(table.body.row.fields)
  }

  if (table.body.add_row_btn) {
    resultTable.add_row_btn = By.css(`${table.root} ${table.body.add_row_btn}`)
  }

  if (table.body.save_row_btn) {
    resultTable.save_row_btn = By.css(
      `${table.root} ${table.body.save_row_btn}`
    )
  }

  return resultTable
}

// table template for filling with selectors
// {
//   root: '',
//   header: {
//     root: '',
//     sorters: {
//       name: ''
//     }
//   },
//   body: {
//     root: '',
//     offset: 0,
//     add_row_btn: '',
//     row: {
//       root: '',
//       fields: {
//         name: ''
//       }
//     }
//   }
// }
