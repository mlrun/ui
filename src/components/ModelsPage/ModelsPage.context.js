import React, { useContext, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { useYaml } from '../../hooks/yaml.hook'
import artifactsAction from '../../actions/artifacts'

export const ModelsPageContext = React.createContext({})

export const ModelsPageProvider = ({ children }) => {
  const [models, setModels] = useState([])
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const dispatch = useDispatch()
  const params = useParams()

  const fetchData = useCallback(
    async filters => {
      return dispatch(artifactsAction.fetchModels(params.projectName, filters)).then(result => {
        if (result) {
          setModels(result)
        }

        return result
      })
    },
    [setModels, params.projectName]
  )

  return (
    <ModelsPageContext.Provider
      value={{
        fetchData,
        convertedYaml,
        models,
        setModels,
        toggleConvertedYaml
      }}
    >
      {children}
    </ModelsPageContext.Provider>
  )
}

export const useModelsPage = () => useContext(ModelsPageContext)
