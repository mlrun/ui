import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { chain, keyBy, mapValues } from 'lodash'

import KeyValueTable from '../../common/KeyValueTable/KeyValueTable'
import Button from '../../common/Button/Button'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import Select from '../../common/Select/Select'
import Input from '../../common/Input/Input'

import artifactsAction from '../../actions/artifacts'
import notificationActions from '../../actions/notification'
import { generateUri } from '../../utils/generateUri'
import { MODELS_TAB } from '../../constants'
import './deployModelPopUp.scss'

const DeployModelPopUp = ({
  buildFunction,
  closePopUp,
  fetchFunctions,
  model,
  setNotification
}) => {
  const [functionsResponse, setFunctionsResponse] = useState([])
  const [modelName, setModelName] = useState(model.db_key)
  const [className, setClassName] = useState('')
  const [classArgumentsList, setClassArgumentsList] = useState([])
  const [functionsList, setFunctionsList] = useState([])
  const [tagsList, setTagsList] = useState([])
  const [selectedFunction, setSelectedFunction] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  const generateTagsList = useCallback(
    (functionsResponse, selectedFunction) => {
      let tags = chain(functionsResponse)
        .filter(
          func =>
            func.metadata.name === selectedFunction && func.metadata.tag !== ''
        )
        .uniqBy('metadata.tag')
        .map(func => ({
          label: func.metadata.tag,
          id: func.metadata.tag
        }))
        .value()

      setTagsList(tags)
      setSelectedTag(tags[0].id)
    },
    []
  )

  useEffect(() => {
    if (functionsList.length === 0) {
      fetchFunctions(model.project).then(response => {
        let functions = chain(response)
          .filter(func => func.kind === 'serving')
          .uniqBy('metadata.name')
          .map(func => ({ label: func.metadata.name, id: func.metadata.name }))
          .value()

        if (functions.length !== 0) {
          setFunctionsResponse(response)
          setFunctionsList(functions)
          setSelectedFunction(functions[0].id)
          generateTagsList(response, functions[0].id)
        }
      })
    }
  }, [fetchFunctions, functionsList.length, generateTagsList, model.project])

  const deployModel = () => {
    const servingFunction = functionsResponse.find(
      func =>
        func.metadata.name === selectedFunction &&
        func.metadata.tag === selectedTag
    )
    const classArguments = mapValues(keyBy(classArgumentsList, 'key'), 'value')

    servingFunction.spec.graph.routes[modelName] = {
      class_args: {
        model_path: generateUri(model, MODELS_TAB),
        ...classArguments
      },
      class_name: className,
      kind: 'task'
    }

    buildFunction({ function: servingFunction })
      .then(response => {
        setNotification({
          status: response.status,
          id: Math.random(),
          message: 'Model deployment initiated successfully'
        })
      })
      .catch(() => {
        setNotification({
          status: 400,
          id: Math.random(),
          message: 'Model deployment failed to initiate',
          retry: deployModel
        })
      })

    closePopUp()
  }

  const onSelectFunction = functionId => {
    setSelectedFunction(functionId)
    generateTagsList(functionsResponse, functionId)
  }

  return (
    <div className="deploy-model">
      <PopUpDialog headerText="Select serving function" closePopUp={closePopUp}>
        <div className="select-row">
          <Select
            label="Serving function"
            floatingLabel
            disabled={functionsList.length === 0}
            options={functionsList}
            selectedId={selectedFunction}
            onClick={onSelectFunction}
          />
          <Select
            label="Tag"
            floatingLabel
            search
            disabled={tagsList.length === 0}
            options={tagsList}
            selectedId={selectedTag}
            onClick={() => {}}
          />
        </div>
        <div className="input-row">
          <Input
            label="Model name"
            floatingLabel
            type="text"
            tip="After the function is deployed, it will have a URL for calling the model that is based upon this name."
            onChange={setModelName}
            value={modelName}
          />
          <Input
            label="Class"
            type="text"
            floatingLabel
            onChange={setClassName}
            value={className}
          />
        </div>
        <KeyValueTable
          keyHeader="Class argument name"
          keyLabel="Class argument name"
          valueHeader="Value"
          valueLabel="Value"
          addNewItemLabel="Add class argument"
          content={classArgumentsList}
          addNewItem={newItem => {
            setClassArgumentsList([...classArgumentsList, newItem])
          }}
          deleteItem={deleteIndex => {
            setClassArgumentsList(
              classArgumentsList.filter((item, index) => index !== deleteIndex)
            )
          }}
        />
        <div className="pop-up-dialog__footer-container">
          <Button
            variant="label"
            label="Cancel"
            className="pop-up-dialog__btn_cancel"
            onClick={closePopUp}
          />
          <Button
            variant="primary"
            disabled={[
              selectedFunction,
              selectedTag,
              modelName,
              className
            ].includes('')}
            label="Deploy"
            onClick={deployModel}
          />
        </div>
      </PopUpDialog>
    </div>
  )
}

DeployModelPopUp.propTypes = {
  closePopUp: PropTypes.func.isRequired,
  model: PropTypes.shape({}).isRequired
}

export default connect(artifactsStore => artifactsStore, {
  ...artifactsAction,
  ...notificationActions
})(DeployModelPopUp)
