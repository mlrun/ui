import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'

import FunctionPanelTopologyModelTableView from './FunctionPanelTopologyModelTableView'

import functionsActions from '../../actions/functions'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

import { ReactComponent as Edit } from '../../images/edit.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'

const FunctionPanelTopologyModelTable = ({
  defaultData,
  functionsStore,
  setNewFunctionGraph
}) => {
  const [data, setData] = useState([])
  const [newRoute, setNewRoute] = useState({
    name: '',
    class_name: '',
    model_path: ''
  })
  const [showAddNewRouteRow, setShowAddNewRouteRow] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState(null)

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
    const generatedRoutes = { ...functionsStore.newFunction.spec.graph.routes }

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
    setNewRoute({
      name: '',
      class_name: '',
      model_path: ''
    })
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
            model_path: selectedRoute.data.model_path,
            class_name: selectedRoute.data.class_name
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

  const generateActionsMenu = useCallback(
    rowItem => [
      {
        label: 'Edit',
        icon: <Edit />,
        onClick: route => setSelectedRoute(route)
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
      editRoute={editRoute}
      generateActionsMenu={generateActionsMenu}
      newRoute={newRoute}
      selectedRoute={selectedRoute}
      setNewRoute={setNewRoute}
      setSelectedRoute={setSelectedRoute}
      setShowAddNewRouteRow={setShowAddNewRouteRow}
      showAddNewRouteRow={showAddNewRouteRow}
    />
  )
}

export default connect(functionsStore => ({ ...functionsStore }), {
  ...functionsActions
})(FunctionPanelTopologyModelTable)
