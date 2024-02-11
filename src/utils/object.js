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
import { isNil } from 'lodash'
import { roundFloats } from './roundFloats'

// {key: "value", key2: "value2"} --> ["key: value", "key2: value2"]
export const parseKeyValues = (object = {}) =>
  object == null
    ? []
    : Object.entries(object).map(([key, value]) => {
        return Array.isArray(value) && value.every(item => !isNil(item))
          ? `${key}: [${value.map(arrayItem => {
              return typeof arrayItem === 'object'
                ? ` {${Object.entries(arrayItem).map(
                    ([arrayItemKey, arrayItemValue]) => ` ${arrayItemKey}: ${arrayItemValue} `
                  )}} `
                : ` ${arrayItem} `
            })}]`
          : typeof value === 'object' && value !== null
          ? `${key}: ${JSON.stringify(value, null, 1)}`
          : `${key}: ${roundFloats(value, 4)}`
      })

// ["key: value", "key2: value2"] -> {key: "value", key2: "value2"}
export const generateKeyValues = (data = []) => {
  const keyValuePairs = {}

  data.forEach(dataItem => {
    const key = dataItem.replace(/:.*$/g, '')
    let value = dataItem.replace(/.*: /g, '')

    if (dataItem.includes(': {')) {
      value = dataItem.replace(/.*: {/g, '{')
    } else if (dataItem.includes(': [')) {
      value = dataItem.replace(/.*: \[/g, '[')
    }

    keyValuePairs[key] = value
  })

  return keyValuePairs
}
