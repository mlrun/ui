import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form } from 'react-final-form'
import { createForm } from 'final-form'
import { chain, keyBy, mapValues } from 'lodash'
import { OnChange } from 'react-final-form-listeners'

import KeyValueTable from '../../common/KeyValueTable/KeyValueTable'
import { Button, ConfirmDialog, FormInput, FormSelect, Modal } from 'igz-controls/components'

import artifactsAction from '../../actions/artifacts'
import notificationActions from '../../actions/notification'
import { generateUri } from '../../utils/resources'
import { MODELS_TAB } from '../../constants'
import { MODAL_SM, SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { openPopUp } from 'igz-controls/utils/common.util'

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
  const [classArgumentsList, setClassArgumentsList] = useState([])
  const [functionOptionList, setFunctionOptionList] = useState([])
  const [tagOptionList, setTagOptionList] = useState([])

  const [initialValues, setInitialValues] = useState({})
  const formRef = React.useRef(
    createForm({
      onSubmit: () => {}
    })
  )

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
      setClassArgumentsList([])
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
    formRef.current.change('selectedFunctionName', functionName)
  }

  const handleTagSelect = tag => {
    formRef.current.change('selectedTag', tag)
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

  const handleCloseModal = FormState => {
    if (FormState && FormState.dirty) {
      openPopUp(ConfirmDialog, {
        cancelButton: {
          label: 'Cancel',
          variant: TERTIARY_BUTTON
        },
        confirmButton: {
          handler: onResolve,
          label: 'OK',
          variant: SECONDARY_BUTTON
        },
        header: 'Are you sure?',
        message: 'All changes will be lost'
      })
    } else {
      onResolve()
    }
  }

  const getModalActions = FormState => {
    const actions = [
      {
        label: 'Cancel',
        onClick: () => handleCloseModal(FormState),
        variant: TERTIARY_BUTTON
      },
      {
        disabled: FormState.submitting || (FormState.invalid && FormState.submitFailed),
        label: 'Deploy',
        onClick: FormState.handleSubmit,
        variant: SECONDARY_BUTTON
      }
    ]
    return actions.map(action => <Button {...action} />)
  }

  return (
    <Form form={formRef.current} initialValues={initialValues} onSubmit={deployModel}>
      {FormState => {
        return (
          <Modal
            actions={getModalActions(FormState)}
            className="deploy-model"
            onClose={() => handleCloseModal(FormState)}
            show={isOpen}
            size={MODAL_SM}
            title="Deploy model"
          >
            <div className="deploy-model__row">
              <div className="col col-2">
                <FormSelect
                  className="form-field__router"
                  disabled={functionOptionList.length === 0}
                  label="Serving function (router)"
                  name="selectedFunctionName"
                  onChange={onSelectFunction}
                  options={functionOptionList}
                />
                <OnChange name="selectedFunctionName">
                  {currentValue => {
                    const tags = getTagOptions(functionList, currentValue)

                    setTagOptionList(tags)
                    formRef.current.change('selectedTag', tags[0].id)
                    formRef.current.change(
                      'className',
                      functionList.find(
                        func =>
                          func.metadata.name === currentValue && func.metadata.tag === tags[0].id
                      )?.spec?.default_class ?? ''
                    )
                  }}
                </OnChange>
              </div>
              <div className="col">
                <FormSelect
                  label="Tag"
                  name="selectedTag"
                  search
                  disabled={tagOptionList.length === 0}
                  onChange={handleTagSelect}
                  options={tagOptionList}
                />
              </div>
              <div className="col">
                <FormInput name="className" label="Class" required />
              </div>
            </div>
            <div className="deploy-model__row">
              <FormInput
                name="modelName"
                label="Model name"
                required
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
                setClassArgumentsList(
                  classArgumentsList.filter((item, index) => index !== deleteIndex)
                )
              }}
              editItem={handleEditClassArgument}
              withEditMode
            />
          </Modal>
        )
      }}
    </Form>
  )
}

DeployModelPopUp.defaultProps = {
  closePopUp: () => {},
  isOpen: false,
  model: {},
  onResolve: () => {}
}

DeployModelPopUp.propTypes = {
  closePopUp: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  model: PropTypes.shape({}).isRequired,
  onResolve: PropTypes.func
}

export default connect(artifactsStore => artifactsStore, {
  ...artifactsAction,
  ...notificationActions
})(DeployModelPopUp)
