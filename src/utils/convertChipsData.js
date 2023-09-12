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

// [{key: "myKey", value: "myValue"}] --> {myKey: "myValue"}
export const convertChipsData = (chips = []) => {
  return chips.reduce((list, label) => {
    list[label.key] = label.value

    return list
  }, {})
}

// {myKey: "myValue"} --> [{id: "myKey0", key: "myKey", value: "myValue"}]
export const parseChipsData = (labels = {}, delimiter = null) => {
  return labels == null
    ? []
    : Object.entries(labels).reduce((result, [key, value], idx) => {
        value =
          Array.isArray(value) && value.every(item => item)
            ? value.map(arrayItem => {
                return typeof arrayItem === 'object'
                  ? Object.entries(arrayItem).map(([arrayItemKey, arrayItemValue]) => ({
                      key: arrayItemKey,
                      value: arrayItemValue
                    }))
                  : arrayItem
              })
            : typeof value === 'object' && value !== null
            ? Object.entries(value).map(([arrayItemKey, arrayItemValue]) => ({
                key: arrayItemKey,
                value: arrayItemValue
              }))
            : value

        result.push({ id: key + idx, key, value, delimiter })
        return result
      }, [])
}
