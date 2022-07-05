import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { chain, keyBy, mapValues } from 'lodash'
import { Form } from 'react-final-form'
import { createForm } from 'final-form'
import arrayMutators from 'final-form-arrays'
import { OnChange } from 'react-final-form-listeners'
import { useLocation } from 'react-router-dom'

import { Button, FormInput, FormKeyValueTable, FormSelect, Modal } from 'igz-controls/components'

import artifactsAction from '../../actions/artifacts'
import notificationActions from '../../actions/notification'
import { MODAL_SM, SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { MODELS_TAB } from '../../constants'
import { generateUri } from '../../utils/resources'
import { getValidationRules } from 'igz-controls/utils/validation.util'
import { setFieldState } from 'igz-controls/utils/form.util'
import { useCloseModal } from '../../hooks/useCloseModal.hook'

import './deployModelPopUp.scss'

const DeployModelPopUp = ({
  buildFunction,
  fetchFunctions,
  isOpen,
  model,
  onResolve,
  setNotification
}) => {
  const [functionList, setFunctionList] = useState([])
  const [functionOptionList, setFunctionOptionList] = useState([])
  const [tagOptionList, setTagOptionList] = useState([])
  const [initialValues, setInitialValues] = useState({
    modelName: '',
    className: '',
    selectedTag: '',
    selectedFunctionName: '',
    arguments: []
  })
  const formRef = React.useRef(
    createForm({
      onSubmit: () => {}
    })
  )
  const location = useLocation()
  const { resolveModal, handleCloseModal } = useCloseModal(onResolve, formRef.current)

  const getTagOptions = useCallback((functionList, selectedFunctionName) => {
    return chain(functionList)
      .filter(func => func.metadata.name === selectedFunctionName && func.metadata.tag !== '')
      .uniqBy('metadata.tag')
      .map(func => ({
        label: func.metadata.tag,
        id: func.metadata.tag
      }))
      .value()
  }, [])

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
  }, [fetchFunctions, functionOptionList.length, initialValues.selectedFunctionName, model.project])

  useEffect(() => {
    setInitialValues(prev => ({ ...prev, modelName: model?.db_key }))
  }, [model])

  useEffect(() => {
    if (!initialValues.selectedTag && functionList.length > 0) {
      const tags = getTagOptions(functionList, initialValues.selectedFunctionName)

      setTagOptionList(tags)
      setInitialValues(prev => ({ ...prev, selectedTag: tags[0]?.id }))
    }
  }, [functionList, getTagOptions, initialValues.selectedFunctionName, initialValues.selectedTag])

  useEffect(() => {
    if (!initialValues.className) {
      const selectedFunction = functionList.find(
        func =>
          func.metadata.name === initialValues.selectedFunctionName &&
          func.metadata.tag === initialValues.selectedTag
      )

      setInitialValues(prev => ({
        ...prev,
        className: selectedFunction ? selectedFunction.spec.default_class : ''
      }))
    }
  }, [
    functionList,
    initialValues.className,
    initialValues.selectedFunctionName,
    initialValues.selectedTag
  ])

  useEffect(() => {
    return () => {
      setFunctionList([])
      setFunctionOptionList([])
      setTagOptionList([])
    }
  }, [])

  const deployModel = values => {
    const servingFunction = functionList.find(
      func =>
        func.metadata.name === values.selectedFunctionName &&
        func.metadata.tag === values.selectedTag
    )
    const classArguments = mapValues(keyBy(values.arguments, 'key'), 'value')

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

    resolveModal()
  }

  const getModalActions = formState => {
    const actions = [
      {
        label: 'Cancel',
        onClick: () => handleCloseModal(formState),
        variant: TERTIARY_BUTTON
      },
      {
        disabled: formState.submitting || (formState.invalid && formState.submitFailed),
        label: 'Deploy',
        onClick: formState.handleSubmit,
        variant: SECONDARY_BUTTON
      }
    ]
    return actions.map(action => <Button {...action} />)
  }

  const onSelectedFunctionNameChange = currentValue => {
    const tags = getTagOptions(functionList, currentValue)
    const defaultClass = functionList.find(
      func => func.metadata.name === currentValue && func.metadata.tag === tags[0].id
    )?.spec?.default_class

    setTagOptionList(tags)
    formRef.current.change('selectedTag', tags[0]?.id ?? '')
    formRef.current.change('className', defaultClass ?? '')
  }

  return (
    <Form
      form={formRef.current}
      initialValues={initialValues}
      mutators={{ ...arrayMutators, setFieldState }}
      onSubmit={deployModel}
    >
      {formState => {
        return (
          <Modal
            actions={getModalActions(formState)}
            className="deploy-model"
            location={location.pathname}
            onClose={() => handleCloseModal(formState)}
            show={isOpen}
            size={MODAL_SM}
            title="Deploy model"
            onResolve={onResolve}
          >
            <div className="form">
              <div className="form-row">
                <div className="form-col-2">
                  <FormSelect
                    className="form-field__router"
                    disabled={functionOptionList.length === 0}
                    label="Serving function (router)"
                    name="selectedFunctionName"
                    options={functionOptionList}
                  />
                  <OnChange name="selectedFunctionName">{onSelectedFunctionNameChange}</OnChange>
                </div>
                <div className="form-col-1">
                  <FormSelect
                    label="Tag"
                    name="selectedTag"
                    search
                    disabled={tagOptionList.length === 0}
                    options={tagOptionList}
                  />
                </div>
                <div className="form-col-1">
                  <FormInput name="className" label="Class" required />
                </div>
              </div>
              <div className="form-row">
                <FormInput
                  name="modelName"
                  label="Model name"
                  required
                  validationRules={getValidationRules('artifact.name')}
                  tip="After the function is deployed, it will have a URL for calling the model that is based upon this name."
                />
              </div>
              <FormKeyValueTable
                keyHeader="Class argument name"
                keyLabel="Class argument name"
                addNewItemLabel="Add class argument"
                name="arguments"
                formState={formState}
              />
            </div>
          </Modal>
        )
      }}
    </Form>
  )
}

DeployModelPopUp.defaultProps = {
  onResolve: () => {}
}

DeployModelPopUp.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  model: PropTypes.shape({}).isRequired,
  onResolve: PropTypes.func
}

const actionCreators = {
  buildFunction: artifactsAction.buildFunction,
  fetchFunctions: artifactsAction.fetchFunctions,
  setNotification: notificationActions.setNotification
}

export default connect(null, {
  ...actionCreators
})(DeployModelPopUp)
