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
export const parseChipsData = (labels = {}, internalLabels = [], delimiter = null) => {
  if (labels == null) {
    return []
  }

  return Object.entries(labels).reduce((result, [key, value], idx) => {
    const disabled = internalLabels.includes(key)
    const tooltip = 'System-defined labels cannot be modified.'

    const processedValue =
      typeof value === 'object' && value !== null ? JSON.stringify(value, null, 2) : value

    result.push({
      id: key + idx,
      key,
      value: processedValue,
      delimiter,
      disabled,
      tooltip: disabled ? tooltip : null
    })

    return result
  }, [])
}

export const parseEntitiesData = (entities = []) => {
  return (
    entities.map((entity, index) => {
      return {
        id: index + entity.name,
        key: entity.name,
        isKeyOnly: true
      }
    }) || []
  )
}
