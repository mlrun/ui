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
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Form } from 'react-final-form'
import { createForm } from 'final-form'

import { Button, FormInput, Modal } from 'igz-controls/components'

import { DATASET_TYPE, MODEL_TYPE } from '../../constants'
import { SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { addTag } from '../../reducers/artifactsReducer'
import { getValidationRules } from 'igz-controls/utils/validation.util'
import { setNotification } from '../../reducers/notificationReducer'
import { showErrorNotification } from '../../utils/notifications.util'
import { useModalBlockHistory } from '../../hooks/useModalBlockHistory.hook'
import { isSubmitDisabled } from 'igz-controls/utils/form.util'

const AddArtifactTagPopUp = ({
  artifact,
  getArtifact,
  isOpen,
  onAddTag = () => {},
  onResolve,
  projectName
}) => {
  const dispatch = useDispatch()
  const [initialValues] = useState({
    artifactTag: ''
  })
  const [existingTags, setExistingTags] = useState([])

  const formRef = React.useRef(
    createForm({
      initialValues,
      onSubmit: () => {}
    })
  )
  const location = useLocation()
  const { handleCloseModal, resolveModal } = useModalBlockHistory(onResolve, formRef.current)

  useEffect(() => {
    getArtifact &&
      dispatch(getArtifact())
        .unwrap()
        .then(results => {
          const tags = results.filter(result => result.tag).map(result => result.tag)
          setExistingTags(tags)
        })
  }, [dispatch, getArtifact])

  const addArtifactTag = values => {
    const identifier = {
      key: artifact.db_key || artifact.key,
      kind: artifact.kind,
      uid: artifact.uid ?? artifact.tree
    }

    if (artifact.iter !== 0) {
      identifier.iter = artifact.iter
    }

    const addTagArgs = {
      project: projectName,
      tag: values.artifactTag,
      data: {
        kind: 'artifact',
        identifiers: [identifier]
      }
    }

    dispatch(addTag(addTagArgs))
      .unwrap()
      .then(response => {
        dispatch(
          setNotification({
            status: response.status,
            id: Math.random(),
            message: 'Tag was added successfully'
          })
        )
        onAddTag?.()
      })
      .catch(error => {
        showErrorNotification(dispatch, error, 'Failed to add a tag', '', () =>
          addArtifactTag(values)
        )
      })

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
        label: 'Add',
        onClick: formState.handleSubmit,
        variant: SECONDARY_BUTTON
      }
    ]

    return actions.map(action => <Button {...action} />)
  }

  return (
    <Form form={formRef.current} initialValues={initialValues} onSubmit={addArtifactTag}>
      {formState => {
        return (
          <Modal
            actions={getModalActions(formState)}
            location={location}
            onClose={handleCloseModal}
            show={isOpen}
            size="min"
            title="Add a tag"
          >
            <div className="form">
              <div className="form-row">
                <div className="form-col-1">
                  <FormInput
                    name="artifactTag"
                    label={`${
                      artifact.kind === MODEL_TYPE
                        ? 'Model tag'
                        : artifact.kind === DATASET_TYPE
                          ? 'Dataset tag'
                          : 'Artifact tag'
                    }`}
                    focused
                    required
                    validationRules={getValidationRules('common.name', [
                      {
                        name: 'uniqueness',
                        label: 'Tag name must be unique',
                        pattern: value => !existingTags.includes(value)
                      }
                    ])}
                  />
                </div>
              </div>
            </div>
          </Modal>
        )
      }}
    </Form>
  )
}

AddArtifactTagPopUp.propTypes = {
  getArtifact: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  artifact: PropTypes.shape({}).isRequired,
  onAddTag: PropTypes.func,
  onResolve: PropTypes.func.isRequired,
  projectName: PropTypes.string.isRequired
}

export default AddArtifactTagPopUp
