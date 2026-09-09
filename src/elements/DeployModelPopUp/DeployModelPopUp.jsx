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
import { chain, cloneDeep, keyBy, mapValues } from 'lodash-es'
import { Form } from 'react-final-form'
import { createForm } from 'final-form'
import arrayMutators from 'final-form-arrays'
import { useLocation } from 'react-router'

import {
  Button,
  FormInput,
  FormKeyValueTable,
  FormSelect,
  Modal,
  FormOnChange
} from 'igz-controls/components'

import { MODELS_PAGE } from '../../constants'
import { MODAL_SM, PRIMARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { buildFunction, fetchArtifactsFunction } from '../../reducers/artifactsReducer'
import { generateUri } from '../../utils/resources'
import { getValidationRules } from 'igz-controls/utils/validation.util'
import { setFieldState, isSubmitDisabled } from 'igz-controls/utils/form.util'
import { setNotification } from 'igz-controls/reducers/notificationReducer'
import { showErrorNotification } from 'igz-controls/utils/notification.util'
import { useModalBlockHistory } from '../../hooks/useModalBlockHistory.hook'

import QuestionMarkIcon from 'igz-controls/images/question-mark.svg?react'

import './deployModelPopUp.scss'

const DeployModelPopUp = ({
  functionList,
  functionOptionList,
  isOpen,
  model,
  onResolve = () => {}
}) => {
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

  // `model`, `functionList` and `functionOptionList` are provided once when this pop-up is
  // opened (see Artifacts.jsx) and do not change afterwards, so their derived values can be
  // computed once as lazy initial state instead of being synced via effects.
  const [tagOptionList, setTagOptionList] = useState(() => {
    const selectedFunctionName = functionOptionList?.[0].id ?? ''

    return functionList.length > 0 ? getTagOptions(functionList, selectedFunctionName) : []
  })
  const [initialValues] = useState(() => {
    const selectedFunctionName = functionOptionList?.[0].id ?? ''
    const selectedTag =
      functionList.length > 0 ? getTagOptions(functionList, selectedFunctionName)[0]?.id : ''
    const selectedFunction = functionList.find(
      func => func.name === selectedFunctionName && func.tag === selectedTag
    )

    return {
      modelName: model?.db_key,
      className: selectedFunction ? selectedFunction.default_class : '',
      selectedTag,
      selectedFunctionName,
      arguments: []
    }
  })
  const dispatch = useDispatch()

  const [form] = useState(() =>
    createForm({
      mutators: { ...arrayMutators, setFieldState },
      onSubmit: () => {}
    })
  )
  const location = useLocation()
  const { handleCloseModal, resolveModal } = useModalBlockHistory(onResolve, form)

  useEffect(() => {
    return () => {
      setTagOptionList([])
    }
  }, [])

  const deployModel = values => {
    const { name, hash, tag, project } =
      functionList.find(
        func => func.name === values.selectedFunctionName && func.tag === values.selectedTag
      ) ?? {}

    dispatch(fetchArtifactsFunction({ project, name, hash, tag }))
      .unwrap()
      .then(servingFunction => {
        const classArguments = mapValues(keyBy(values.arguments, 'key'), 'value')
        const servingFunctionCopy = cloneDeep(servingFunction.ui.originalContent)

        servingFunctionCopy.spec.graph = {
          ...servingFunctionCopy.spec.graph,
          routes: {
            [values.modelName]: {
              class_args: {
                model_path: generateUri(model, MODELS_PAGE),
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
          })
      })
      .catch(error => {
        showErrorNotification(dispatch, error, '', 'Failed to retrieve function data', () =>
          deployModel(values)
        )
      })
  }

  const submitHandler = values => {
    deployModel(values)
    resolveModal()
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
        variant: PRIMARY_BUTTON
      }
    ]
    return actions.map((action, index) => <Button {...action} key={index} />)
  }

  const onSelectedFunctionNameChange = currentValue => {
    const tags = getTagOptions(functionList, currentValue)
    const defaultClass = functionList.find(
      func => func.name === currentValue && func.tag === tags[0].id
    )?.default_class

    setTagOptionList(tags)
    form.change('selectedTag', tags[0]?.id ?? '')
    form.change('className', defaultClass ?? '')
  }

  return (
    <>
      <Form form={form} initialValues={initialValues} onSubmit={submitHandler}>
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
  functionList: PropTypes.arrayOf(PropTypes.object).isRequired,
  functionOptionList: PropTypes.arrayOf(PropTypes.object).isRequired,
  isOpen: PropTypes.bool.isRequired,
  model: PropTypes.object.isRequired,
  onResolve: PropTypes.func
}

export default DeployModelPopUp
