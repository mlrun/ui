import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { chain, keyBy, mapValues } from 'lodash'

import { Button } from 'igz-controls/components'
import Input from '../../common/Input/Input'
import KeyValueTable from '../../common/KeyValueTable/KeyValueTable'
import Modal from '../../common/Modal/Modal'
import Select from '../../common/Select/Select'

import artifactsAction from '../../actions/artifacts'
import notificationActions from '../../actions/notification'
import { generateUri } from '../../utils/resources'

import { SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { MODELS_TAB } from '../../constants'

import './deployModelPopUp.scss'

const DeployModelPopUp = ({
  buildFunction,
  closePopUp,
  fetchFunctions,
  isOpen,
  model,
  onResolve,
  onReject,
  setNotification
}) => {
  const [functionList, setFunctionList] = useState([])
  const [modelName, setModelName] = useState('')
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
          .filter(func => func.kind === 'serving' && func?.spec?.graph?.kind === 'router')
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
    setModelName(model?.db_key)
  }, [model])

  useEffect(() => {
    const tags = chain(functionList)
      .filter(func => func.metadata.name === selectedFunctionName && func.metadata.tag !== '')
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
      func => func.metadata.name === selectedFunctionName && func.metadata.tag === selectedTag
    )

    if (selectedFunction) {
      setClassName(selectedFunction.spec.default_class)
    }
  }, [functionList, selectedFunctionName, selectedTag])

  useEffect(() => {
    return (
      () => {
        setClassArgumentsList([])
        setClassName('')
        setFunctionList([])
        setFunctionOptionList([])
        setModelName('')
        setSelectedFunctionName('')
        setSelectedTag('')
        setTagOptionList([])
      },
      []
    )
  })

  const handleClosePopup = () => {
    onReject && onReject()
    closePopUp && closePopUp()
  }

  const deployModel = () => {
    const servingFunction = functionList.find(
      func => func.metadata.name === selectedFunctionName && func.metadata.tag === selectedTag
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

    handleClosePopup()
  }

  const onSelectFunction = functionName => {
    setSelectedFunctionName(functionName)
  }

  const handleTagSelect = tag => {
    setSelectedTag(tag)
  }

  const handleEditClassArgument = updatedClassArg => {
    const newClassArguments = classArgumentsList.map(classArg => {
      if (classArg.key === updatedClassArg.key) {
        classArg.key = updatedClassArg.newKey || updatedClassArg.key
        classArg.value = updatedClassArg.value
      }
      return classArg
    })

    setClassArgumentsList(newClassArguments)
  }

  return (
    <Modal
      actions={[
        <Button variant={TERTIARY_BUTTON} label="Cancel" onClick={handleClosePopup} />,
        <Button
          variant={SECONDARY_BUTTON}
          disabled={[selectedFunctionName, selectedTag, modelName, className].includes('')}
          label="Deploy"
          onClick={deployModel}
        />
      ]}
      className="deploy-model"
      onClose={handleClosePopup}
      show={isOpen}
      size="sm"
      title="Deploy model"
    >
      <div className="deploy-model__row">
        <Select
          className="select-router"
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
        <Input label="Class" type="text" floatingLabel onChange={setClassName} value={className} />
      </div>
      <div className="deploy-model__row">
        <Input
          label="Model name"
          floatingLabel
          type="text"
          tip="After the function is deployed, it will have a URL for calling the model that is based upon this name."
          onChange={setModelName}
          value={modelName}
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
          setClassArgumentsList(classArgumentsList.filter((item, index) => index !== deleteIndex))
        }}
        editItem={handleEditClassArgument}
        withEditMode
      />
    </Modal>
  )
}

DeployModelPopUp.propTypes = {
  closePopUp: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  model: PropTypes.shape({}).isRequired
}

export default connect(artifactsStore => artifactsStore, {
  ...artifactsAction,
  ...notificationActions
})(DeployModelPopUp)
