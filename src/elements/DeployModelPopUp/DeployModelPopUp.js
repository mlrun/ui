import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { chain, keyBy, mapValues } from 'lodash'

import KeyValueTable from '../../common/KeyValueTable/KeyValueTable'
import { FormInput, FormSelect, Wizard } from 'igz-controls/components'

import artifactsAction from '../../actions/artifacts'
import notificationActions from '../../actions/notification'
import { generateUri } from '../../utils/resources'

import { MODAL_SM, SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { MODELS_TAB } from '../../constants'

import './deployModelPopUp.scss'

const DeployModelPopUp = ({
  buildFunction,
  fetchFunctions,
  isOpen,
  model,
  onResolve,
  onReject,
  setNotification
}) => {
  const [functionList, setFunctionList] = useState([])
  const [initialValues, setInitialValues] = useState({
    className: '',
    modelName: '',
    selectedFunctionName: '',
    selectedTag: ''
  })
  const [classArgumentsList, setClassArgumentsList] = useState([])
  const [functionOptionList, setFunctionOptionList] = useState([])
  const [tagOptionList, setTagOptionList] = useState([])

  useEffect(() => {
    if (functionOptionList.length === 0) {
      fetchFunctions(model.project, {}, false).then(functions => {
        const functionOptions = chain(functions)
          .filter(func => func.kind === 'serving' && func?.spec?.graph?.kind === 'router')
          .uniqBy('metadata.name')
          .map(func => ({ label: func.metadata.name, id: func.metadata.name }))
          .value()

        if (functionOptions.length !== 0) {
          setFunctionList(functions)
          setFunctionOptionList(functionOptions)
          setInitialValues(prev => ({ ...prev, selectedFunctionName: functionOptions[0].id }))
        }
      })
    }
  }, [fetchFunctions, functionOptionList.length, model.project])

  useEffect(() => {
    setInitialValues(prev => ({ ...prev, modelName: model?.db_key }))
  }, [model])

  useEffect(() => {
    const tags = chain(functionList)
      .filter(
        func =>
          func.metadata.name === initialValues.selectedFunctionName && func.metadata.tag !== ''
      )
      .uniqBy('metadata.tag')
      .map(func => ({
        label: func.metadata.tag,
        id: func.metadata.tag
      }))
      .value()

    setTagOptionList(tags)
    setInitialValues(prev => ({ ...prev, selectedTag: tags[0]?.id }))
  }, [functionList, initialValues.selectedFunctionName])

  useEffect(() => {
    const selectedFunction = functionList.find(
      func =>
        func.metadata.name === initialValues.selectedFunctionName &&
        func.metadata.tag === initialValues.selectedTag
    )

    setInitialValues(prev => ({
      ...prev,
      className: selectedFunction ? selectedFunction.spec.default_class : ''
    }))
  }, [functionList, initialValues.selectedFunctionName, initialValues.selectedTag])

  useEffect(() => {
    return (
      () => {
        setClassArgumentsList([])
        setInitialValues({})
        setFunctionList([])
        setFunctionOptionList([])
        setTagOptionList([])
      },
      []
    )
  })

  const deployModel = values => {
    if (values) {
      console.log(values)
      return
    }
    const servingFunction = functionList.find(
      func =>
        func.metadata.name === values.selectedFunctionName &&
        func.metadata.tag === initialValues.selectedTag
    )
    const classArguments = mapValues(keyBy(classArgumentsList, 'key'), 'value')

    servingFunction.spec.graph.routes[values.modelName] = {
      class_args: {
        model_path: generateUri(model, MODELS_TAB),
        ...classArguments
      },
      class_name: values.className,
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

    onResolve()
  }

  const onSelectFunction = functionName => {
    setInitialValues(prev => ({ ...prev, selectedFunctionName: functionName }))
  }

  const handleTagSelect = tag => {
    setInitialValues(prev => ({ ...prev, selectedTag: tag }))
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

  const stepsConfig = [
    {
      getActions: ({ FormState, handleOnClose }) => {
        return [
          {
            label: 'Cancel',
            onClick: handleOnClose,
            variant: TERTIARY_BUTTON
          },
          {
            disabled: FormState.invalid,
            label: 'Deploy',
            onClick: FormState.handleSubmit,
            variant: SECONDARY_BUTTON
          }
        ]
      }
    }
  ]

  return (
    <Wizard
      className="deploy-model"
      confirmClose
      initialValues={initialValues}
      isWizardOpen={isOpen}
      onWizardResolve={onResolve}
      onWizardSubmit={deployModel}
      size={MODAL_SM}
      title="Deploy model"
      stepsConfig={stepsConfig}
    >
      <>
        <div className="deploy-model__row">
          <FormSelect
            className="form-field__router"
            disabled={functionOptionList.length === 0}
            label="Serving function (router)"
            name="selectedFunctionName"
            onChange={onSelectFunction}
            options={functionOptionList}
          />

          <FormSelect
            label="Tag"
            name="selectedTag"
            search
            disabled={tagOptionList.length === 0}
            onChange={handleTagSelect}
            options={tagOptionList}
          />

          <FormInput name="className" label="Class" required />
        </div>
        <div className="deploy-model__row">
          <FormInput
            name="modelName"
            label="Model name"
            required
            type="textarea"
            tip="After the function is deployed, it will have a URL for calling the model that is based upon this name."
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
      </>
    </Wizard>
  )
}

DeployModelPopUp.defaultProps = {
  closePopUp: () => {},
  isOpen: false,
  model: {},
  onResolve: () => {},
  onReject: () => {}
}

DeployModelPopUp.propTypes = {
  closePopUp: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  model: PropTypes.shape({}).isRequired,
  onResolve: PropTypes.func,
  onReject: PropTypes.func
}

export default connect(artifactsStore => artifactsStore, {
  ...artifactsAction,
  ...notificationActions
})(DeployModelPopUp)
