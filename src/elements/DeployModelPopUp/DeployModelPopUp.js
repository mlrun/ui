import React, { useEffect, useState } from 'react'
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
import { generateUri } from '../../utils/resources'
import { LABEL_BUTTON, MODELS_TAB, PRIMARY_BUTTON } from '../../constants'

import './deployModelPopUp.scss'

const DeployModelPopUp = ({
  buildFunction,
  closePopUp,
  fetchFunctions,
  model,
  setNotification
}) => {
  const [functionList, setFunctionList] = useState([])
  const [modelName, setModelName] = useState(model.db_key)
  const [className, setClassName] = useState('')
  const [classArgumentsList, setClassArgumentsList] = useState([])
  const [functionOptionList, setFunctionOptionList] = useState([])
  const [tagOptionList, setTagOptionList] = useState([])
  const [selectedFunctionName, setSelectedFunctionName] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  useEffect(() => {
    if (functionOptionList.length === 0) {
      fetchFunctions(model.project).then(functions => {
        const functionOptions = chain(functions)
          .filter(
            func =>
              func.kind === 'serving' && func?.spec?.graph?.kind === 'router'
          )
          .uniqBy('metadata.name')
          .map(func => ({ label: func.metadata.name, id: func.metadata.name }))
          .value()

        if (functionOptions.length !== 0) {
          setFunctionList(functions)
          setFunctionOptionList(functionOptions)
          setSelectedFunctionName(functionOptions[0].id)
        }
      })
    }
  }, [fetchFunctions, functionOptionList.length, model.project])

  useEffect(() => {
    const tags = chain(functionList)
      .filter(
        func =>
          func.metadata.name === selectedFunctionName &&
          func.metadata.tag !== ''
      )
      .uniqBy('metadata.tag')
      .map(func => ({
        label: func.metadata.tag,
        id: func.metadata.tag
      }))
      .value()

    setTagOptionList(tags)
    setSelectedTag(tags[0]?.id)
  }, [functionList, selectedFunctionName])

  useEffect(() => {
    const selectedFunction = functionList.find(
      func =>
        func.metadata.name === selectedFunctionName &&
        func.metadata.tag === selectedTag
    )

    if (selectedFunction) {
      setClassName(selectedFunction.spec.default_class)
    }
  }, [functionList, selectedFunctionName, selectedTag])

  const deployModel = () => {
    const servingFunction = functionList.find(
      func =>
        func.metadata.name === selectedFunctionName &&
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

  const onSelectFunction = functionName => {
    setSelectedFunctionName(functionName)
  }

  const handleTagSelect = tag => {
    setSelectedTag(tag)
  }

  return (
    <PopUpDialog
      className="deploy-model"
      closePopUp={closePopUp}
      headerText="Deploy model"
    >
      <div className="select-row">
        <Select
          label="Serving function (router)"
          floatingLabel
          disabled={functionOptionList.length === 0}
          options={functionOptionList}
          selectedId={selectedFunctionName}
          onClick={onSelectFunction}
        />
        <Select
          label="Tag"
          floatingLabel
          search
          disabled={tagOptionList.length === 0}
          options={tagOptionList}
          selectedId={selectedTag}
          onClick={handleTagSelect}
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
          variant={LABEL_BUTTON}
          label="Cancel"
          className="pop-up-dialog__btn_cancel"
          onClick={closePopUp}
        />
        <Button
          variant={PRIMARY_BUTTON}
          disabled={[
            selectedFunctionName,
            selectedTag,
            modelName,
            className
          ].includes('')}
          label="Deploy"
          onClick={deployModel}
        />
      </div>
    </PopUpDialog>
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
