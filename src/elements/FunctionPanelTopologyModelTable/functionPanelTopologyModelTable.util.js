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

export const tableHeaders = [
  { label: 'Name', id: 'name' },
  { label: 'Class', id: 'class' },
  { label: 'Path', id: 'path' }
]

export const isNameNotUnique = (name, routes) => {
  return routes.some(route => route.data.name === name)
}

export const isRouteValid = route => {
  return (
    route.name.length > 0 &&
    route.class_name.length > 0 &&
    route.model_path.length > 0
  )
}

export const isEditableRouteValid = (route, routes) => {
  if (!isNil(route.newName) && route.newName !== route.data.name) {
    return (
      route.newName.length > 0 &&
      !isNameNotUnique(route.newName, routes) &&
      route.data.class_name.length > 0 &&
      route.data.model_path.length > 0
    )
  } else {
    return isRouteValid(route.data)
  }
}

export const validationInitialState = {
  isNameValid: true,
  isClassNameValid: true,
  isModelPathValid: true,
  isEditNameValid: true,
  isEditClassNameValid: true,
  isEditModelPathValid: true
}

export const newRouteInitialState = {
  name: '',
  class_name: '',
  model_path: ''
}
