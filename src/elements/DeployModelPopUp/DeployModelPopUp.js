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
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { chain, keyBy, mapValues } from 'lodash'
import { Form } from 'react-final-form'
import { createForm } from 'final-form'
import arrayMutators from 'final-form-arrays'
import { OnChange } from 'react-final-form-listeners'
import { useLocation } from 'react-router-dom'

import { Button, FormInput, FormKeyValueTable, FormSelect, Modal } from 'igz-controls/components'

import { setNotification } from '../../reducers/notificationReducer'
import { MODAL_SM, SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { MODELS_TAB } from '../../constants'
import { generateUri } from '../../utils/resources'
import { getValidationRules } from 'igz-controls/utils/validation.util'
import { setFieldState } from 'igz-controls/utils/form.util'
import { useModalBlockHistory } from '../../hooks/useModalBlockHistory.hook'
import { buildFunction, fetchArtifactsFunctions } from '../../reducers/artifactsReducer'

import './deployModelPopUp.scss'

const DeployModelPopUp = ({ isOpen, model, onResolve }) => {
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
  const dispatch = useDispatch()

  const formRef = React.useRef(
    createForm({
      onSubmit: () => {}
    })
  )
  const location = useLocation()
  const { handleCloseModal } = useModalBlockHistory(onResolve, formRef.current)

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
      dispatch(fetchArtifactsFunctions({ project: model.project, filters: {} }))
        .unwrap()
        .then(functions => {
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
  }, [dispatch, functionOptionList.length, initialValues.selectedFunctionName, model.project])

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

    return dispatch(buildFunction({ funcData: { function: servingFunction } }))
      .unwrap()
      .then(response => {
        formRef.current = null
        dispatch(
          setNotification({
            status: response.status,
            id: Math.random(),
            message: 'Model deployment initiated successfully'
          })
        )
      })
      .catch(() => {
        dispatch(
          setNotification({
            status: 400,
            id: Math.random(),
            message: 'Model deployment failed to initiate',
            retry: deployModel
          })
        )
      })
      .finally(() => {
        onResolve()
      })
  }

  const getModalActions = formState => {
    const actions = [
      {
        label: 'Cancel',
        onClick: () => handleCloseModal(),
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
            location={location}
            onClose={handleCloseModal}
            show={isOpen}
            size={MODAL_SM}
            title="Deploy model"
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
                    required
                  />
                  <OnChange name="selectedFunctionName">{onSelectedFunctionNameChange}</OnChange>
                </div>
                <div className="form-col-1">
                  <FormSelect
                    disabled={tagOptionList.length === 0}
                    label="Tag"
                    name="selectedTag"
                    options={tagOptionList}
                    required
                    search
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
                addNewItemLabel="Add class argument"
                fieldsPath="arguments"
                formState={formState}
                keyHeader="Class argument name"
                keyLabel="Class argument name"
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

export default DeployModelPopUp
