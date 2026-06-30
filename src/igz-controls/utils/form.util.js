/*
Copyright 2022 Iguazio Systems Ltd.
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
import { get, isEmpty, isEqual, isNil, mapValues, set, some } from 'lodash'

export const setFieldState = (args, state) => {
  let fieldName = args[0]
  let states = args[1]
  let field = state.fields[fieldName]

  if (field) {
    for (let stateName in states) {
      set(field, stateName, states[stateName])
    }
  }
}

export const areFormValuesChanged = (initialValues, values) => {
  const replacer = (key, value) => {
    if (value === '') {
      return undefined
    }

    return value
  }

  return !isEqual(
    JSON.stringify(clearObjectFromEmptyArrayElements(initialValues), replacer),
    JSON.stringify(clearObjectFromEmptyArrayElements(values), replacer)
  )
}

export const generateObjectFromKeyValue = (keyValueList = []) => {
  return keyValueList.reduce((acc, keyValue) => {
    acc[keyValue.data.key] = keyValue.data.value

    return acc
  }, {})
}

export const parseObjectToKeyValue = (object = {}) => {
  return Object.entries(object).map(([key, value]) => {
    return {
      data: {
        key,
        value
      }
    }
  })
}

export const isSubmitDisabled = formState => {
  return formState.submitting || (formState.invalid && formState.submitFailed)
}

const clearObjectFromEmptyArrayElements = (obj = {}) => {
  return mapValues(obj, objValue => {
    if (!Array.isArray(objValue)) return objValue

    return clearArrayFromEmptyObjectElements(objValue)
  })
}

export const clearArrayFromEmptyObjectElements = (arr = []) => {
  return arr.filter(arrayElement => {
    return some(get(arrayElement, 'data', arrayElement), val => !isNil(val) && !isEmpty(val))
  })
}
