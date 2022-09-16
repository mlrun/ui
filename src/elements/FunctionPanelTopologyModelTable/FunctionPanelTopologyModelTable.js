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
import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'

import FunctionPanelTopologyModelTableView from './FunctionPanelTopologyModelTableView'

import functionsActions from '../../actions/functions'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import {
  isRouteValid,
  newRouteInitialState,
  validationInitialState
} from './functionPanelTopologyModelTable.util'

import { ReactComponent as Edit } from 'igz-controls/images/edit.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'

const FunctionPanelTopologyModelTable = ({
  defaultData,
  functionsStore,
  setNewFunctionGraph
}) => {
  const [data, setData] = useState([])
  const [newRoute, setNewRoute] = useState(newRouteInitialState)
  const [showAddNewRouteRow, setShowAddNewRouteRow] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [validation, setValidation] = useState(validationInitialState)

  useEffect(() => {
    if (!isEveryObjectValueEmpty(defaultData.graph?.routes ?? {})) {
      setData(
        Object.entries(defaultData.graph.routes).map(([key, value]) => ({
          isDefault: true,
          data: {
            name: key,
            class_name: value.class_name,
            model_path: value.class_args.model_path
          }
        }))
      )
    }
  }, [defaultData.graph])

  const addRoute = () => {
    const generatedRoutes = { ...functionsStore.newFunction.spec.graph?.routes }
    if (
      !isRouteValid(newRoute) ||
      !validation.isNameValid ||
      !validation.isClassNameValid ||
      !validation.isModelPathValid
    ) {
      return setValidation(state => ({
        ...state,
        isNameValid: newRoute.name.length > 0,
        isClassNameValid: newRoute.class_name.length > 0,
        isModelPathValid: newRoute.model_path.length > 0
      }))
    }

    generatedRoutes[newRoute.name] = {
      kind: 'task',
      class_name: newRoute.class_name,
      class_args: {
        model_path: newRoute.model_path
      }
    }

    setData(state => [
      ...state,
      {
        isDefault: false,
        data: {
          name: newRoute.name,
          class_name: newRoute.class_name,
          model_path: newRoute.model_path
        }
      }
    ])
    setNewFunctionGraph({
      ...functionsStore.newFunction.spec.graph,
      routes: generatedRoutes
    })
    setNewRoute(newRouteInitialState)
    setShowAddNewRouteRow(false)
  }

  const deleteRoute = useCallback(
    route => {
      const generatedRoutes = {
        ...functionsStore.newFunction.spec.graph.routes
      }

      delete generatedRoutes[route.data.name]

      setData(state =>
        state.filter(stateRoute => stateRoute.data.name !== route.data.name)
      )
      setNewFunctionGraph({
        ...functionsStore.newFunction.spec.graph,
        routes: generatedRoutes
      })
    },
    [functionsStore.newFunction.spec.graph, setNewFunctionGraph]
  )

  const editRoute = () => {
    const generatedRoutes = { ...functionsStore.newFunction.spec.graph.routes }
    const key = selectedRoute.newName || selectedRoute.data.name

    if (selectedRoute.newName) {
      delete generatedRoutes[selectedRoute.data.name]
    }
    if (
      !isRouteValid(selectedRoute.data) ||
      !validation.isEditNameValid ||
      !validation.isEditClassNameValid ||
      !validation.isEditModelPathValid
    ) {
      return setValidation(state => ({
        ...state,
        isEditNameValid: selectedRoute.data.name.length > 0,
        isEditClassNameValid: selectedRoute.data.class_name.length > 0,
        isEditModelPathValid: selectedRoute.data.model_path.length > 0
      }))
    }

    generatedRoutes[key] = {
      kind: 'task',
      class_name: selectedRoute.data.class_name,
      class_args: {
        model_path: selectedRoute.data.model_path
      }
    }

    setSelectedRoute(null)
    setData(state =>
      state.map(route => {
        if (route.data.name === selectedRoute.data.name) {
          route.data = {
            name: selectedRoute.newName || selectedRoute.data.name,
            class_name: selectedRoute.data.class_name,
            model_path: selectedRoute.data.model_path
          }
        }

        return route
      })
    )
    setNewFunctionGraph({
      ...functionsStore.newFunction.spec.graph,
      routes: generatedRoutes
    })
  }

  const discardChanges = () => {
    setNewRoute(newRouteInitialState)
    setShowAddNewRouteRow(false)
    setValidation(validationInitialState)
  }

  const generateActionsMenu = useCallback(
    rowItem => [
      {
        label: 'Edit',
        icon: <Edit />,
        onClick: route => {
          setSelectedRoute(route)
          setValidation(validationInitialState)
        }
      },
      {
        label: 'Remove',
        icon: <Delete />,
        onClick: selectedItem => {
          deleteRoute(selectedItem)
        }
      }
    ],
    [deleteRoute]
  )

  return (
    <FunctionPanelTopologyModelTableView
      addRoute={addRoute}
      data={data}
      deleteRoute={deleteRoute}
      discardChanges={discardChanges}
      editRoute={editRoute}
      generateActionsMenu={generateActionsMenu}
      newRoute={newRoute}
      selectedRoute={selectedRoute}
      setNewRoute={setNewRoute}
      setSelectedRoute={setSelectedRoute}
      setShowAddNewRouteRow={setShowAddNewRouteRow}
      setValidation={setValidation}
      showAddNewRouteRow={showAddNewRouteRow}
      validation={validation}
    />
  )
}

export default connect(functionsStore => ({ ...functionsStore }), {
  ...functionsActions
})(FunctionPanelTopologyModelTable)
