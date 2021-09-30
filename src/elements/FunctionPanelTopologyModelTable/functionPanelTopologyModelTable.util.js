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
