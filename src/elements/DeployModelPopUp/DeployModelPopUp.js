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
import { chain, cloneDeep, keyBy, mapValues } from 'lodash'
import { Form } from 'react-final-form'
import { createForm } from 'final-form'
import arrayMutators from 'final-form-arrays'
import { useLocation } from 'react-router-dom'

import {
  Button,
  FormInput,
  FormKeyValueTable,
  FormSelect,
  Modal,
  FormOnChange
} from 'igz-controls/components'

import { MODELS_TAB } from '../../constants'
import { MODAL_SM, SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { buildFunction } from '../../reducers/artifactsReducer'
import { generateUri } from '../../utils/resources'
import { getValidationRules } from 'igz-controls/utils/validation.util'
import { setFieldState, isSubmitDisabled } from 'igz-controls/utils/form.util'
import { setNotification } from '../../reducers/notificationReducer'
import { showErrorNotification } from '../../utils/notifications.util'
import { useModalBlockHistory } from '../../hooks/useModalBlockHistory.hook'

import { ReactComponent as QuestionMarkIcon } from 'igz-controls/images/question-mark.svg'

import './deployModelPopUp.scss'

const DeployModelPopUp = ({
  functionList,
  functionOptionList,
  isOpen,
  model,
  onResolve = () => {}
}) => {
  const [tagOptionList, setTagOptionList] = useState([])
  const [initialValues, setInitialValues] = useState({
    modelName: '',
    className: '',
    selectedTag: '',
    selectedFunctionName: functionOptionList?.[0].id ?? '',
    arguments: []
  })
  const dispatch = useDispatch()

  const formRef = React.useRef(
    createForm({
      onSubmit: () => {}
    })
  )
  const location = useLocation()
  const { handleCloseModal, resolveModal } = useModalBlockHistory(onResolve, formRef.current)

  const getTagOptions = useCallback((functionList, selectedFunctionName) => {
    return chain(functionList)
      .filter(func => func.name === selectedFunctionName && func.tag !== '')
      .uniqBy('tag')
      .map(func => ({
        label: func.tag,
        id: func.tag
      }))
      .value()
  }, [])

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
          func.name === initialValues.selectedFunctionName && func.tag === initialValues.selectedTag
      )

      setInitialValues(prev => ({
        ...prev,
        className: selectedFunction ? selectedFunction.default_class : ''
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
      setTagOptionList([])
    }
  }, [])

  const deployModel = values => {
    const servingFunction = functionList.find(
      func => func.name === values.selectedFunctionName && func.tag === values.selectedTag
    )
    const classArguments = mapValues(keyBy(values.arguments, 'key'), 'value')
    const servingFunctionCopy = cloneDeep(servingFunction.ui.originalContent)

    servingFunctionCopy.spec.graph = {
      ...servingFunctionCopy.spec.graph,
      routes: {
        [values.modelName]: {
          class_args: {
            model_path: generateUri(model, MODELS_TAB),
            ...classArguments
          },
          class_name: values.className,
          kind: 'task'
        }
      }
    }

    return dispatch(buildFunction({ funcData: { function: servingFunctionCopy } }))
      .unwrap()
      .then(response => {
        resolveModal()
        dispatch(
          setNotification({
            status: response.status,
            id: Math.random(),
            message: 'Model deployment initiated successfully'
          })
        )
      })
      .catch(error => {
        showErrorNotification(dispatch, error, '', 'Model deployment failed to initiate', () =>
          deployModel(values)
        )
        resolveModal()
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
        disabled: isSubmitDisabled(formState),
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
      func => func.name === currentValue && func.tag === tags[0].id
    )?.default_class

    setTagOptionList(tags)
    formRef.current.change('selectedTag', tags[0]?.id ?? '')
    formRef.current.change('className', defaultClass ?? '')
  }

  return (
    <>
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
                {functionOptionList.length === 0 && (
                  <div className="form-row">
                    <div className="form-text info-container">
                      <QuestionMarkIcon />
                      <span>
                        A model can only be deployed to an existing serving function with "router"
                        topology. <br /> To deploy the model to a new function, first deploy the
                        serving function.
                      </span>
                    </div>
                  </div>
                )}
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
                    <FormOnChange
                      handler={onSelectedFunctionNameChange}
                      name="selectedFunctionName"
                    />
                  </div>
                  <div className="form-col-1">
                    <FormSelect
                      disabled={tagOptionList.length === 0}
                      label="Tag"
                      name="selectedTag"
                      options={tagOptionList}
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
    </>
  )
}

DeployModelPopUp.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  model: PropTypes.shape({}).isRequired,
  onResolve: PropTypes.func
}

export default DeployModelPopUp
