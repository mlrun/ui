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
import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Form } from 'react-final-form'
import { createForm } from 'final-form'
import arrayMutators from 'final-form-arrays'
import PropTypes from 'prop-types'

import {
  ConfirmDialog,
  FormRadio,
  FormKeyValueTable,
  FormCheckBox,
  FormOnChange
} from 'igz-controls/components'
import { TERTIARY_BUTTON, DANGER_BUTTON } from 'igz-controls/constants'

import { handleDeleteArtifact } from '../../utils/handleDeleteArtifact'
import { getValidationRules } from 'igz-controls/utils/validation.util'
import { setFieldState } from 'igz-controls/utils/form.util'

import { ReactComponent as AlertIcon } from 'igz-controls/images/alert-yellow.svg'

import './deleteArtifactPopUp.scss'

const DeleteArtifactPopUp = ({ artifact, artifactType, category, filters, handleRefresh }) => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(true)
  const [disableConfirmButton, setDisableConfirmButton] = useState(false)
  const dispatch = useDispatch()
  const params = useParams()
  const formRef = React.useRef(
    createForm({
      initialValues: {
        deletion_strategy: 'metadata-only',
        extended_deletion_strategy: false,
        secrets: []
      },
      mutators: { ...arrayMutators, setFieldState },
      onSubmit: () => {}
    })
  )

  const handleCancel = () => {
    setIsConfirmDialogOpen(false)
  }

  const handleDelete = useCallback(() => {
    const secrets = {}

    formRef.current.getState().values.secrets.forEach(secret => {
      secrets[secret.data.key] = secret.data.value
    })

    handleDeleteArtifact(
      dispatch,
      params.projectName,
      artifact.db_key,
      artifact.tag,
      artifact.tree,
      handleRefresh,
      filters,
      artifactType,
      category,
      false,
      formRef.current.getState().values.deletion_strategy,
      secrets
    ).then(() => {
      setIsConfirmDialogOpen(false)
    })
  }, [
    artifact.db_key,
    artifact.tag,
    artifact.tree,
    artifactType,
    category,
    dispatch,
    filters,
    handleRefresh,
    params.projectName
  ])

  const toggleExtendedDeletionStrategy = value => {
    formRef.current.change('deletion_strategy', value ? '' : 'metadata-only')

    if (formRef.current.getState().values.secrets.length > 0) {
      formRef.current.change('secrets', [])
    }

    setDisableConfirmButton(value)
  }

  const onDeletionStrategyChange = () => {
    setDisableConfirmButton(false)
  }

  return (
    <ConfirmDialog
      cancelButton={{
        handler: () => handleCancel(),
        label: 'Cancel',
        variant: TERTIARY_BUTTON
      }}
      className="delete-artifact-pop-up"
      confirmButton={{
        handler: () => handleDelete(),
        label: 'Delete',
        variant: DANGER_BUTTON,
        disabled: disableConfirmButton
      }}
      header={`Delete ${artifactType}?`}
      isOpen={isConfirmDialogOpen}
      message={`Are you sure you want to delete the ${artifactType} "${artifact.db_key}" metadata? Deleted metadata can not be restored.`}
    >
      <Form form={formRef.current} onSubmit={() => {}}>
        {formState => {
          const extended_deletion_strategy = formState.values.extended_deletion_strategy

          return (
            <>
              <FormCheckBox
                label={`Delete ${artifactType} data, not only the ${artifactType} metadata.`}
                name="extended_deletion_strategy"
              />
              <FormOnChange
                handler={toggleExtendedDeletionStrategy}
                name="extended_deletion_strategy"
              />
              {extended_deletion_strategy && (
                <>
                  <div className="warning">
                    <AlertIcon className="warning__icon" />
                    This action will permanently remove the data associated with the {artifactType}
                  </div>
                  <div className="delete-artifact-pop-up__extended-data">
                    <h4>If data deletion fails:</h4>
                    <FormRadio
                      label={`Do not delete the ${artifactType} metadata.`}
                      name="deletion_strategy"
                      value="data-force"
                    />
                    <FormOnChange handler={onDeletionStrategyChange} name="deletion_strategy" />
                    <FormRadio
                      label={`Delete the ${artifactType} metadata, even if the data deletion fails.`}
                      name="deletion_strategy"
                      value="data-optional"
                    />
                    <FormOnChange handler={onDeletionStrategyChange} name="deletion_strategy" />
                    <div className="secrets-table">
                      {formState.values.deletion_strategy !== 'metadata-only' && (
                        <FormKeyValueTable
                          addNewItemLabel="Add secret"
                          isKeyEditable={false}
                          isValuePassword={true}
                          valueType="password"
                          keyValidationRules={getValidationRules('project.secrets.key')}
                          fieldsPath="secrets"
                          formState={formState}
                        />
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )
        }}
      </Form>
    </ConfirmDialog>
  )
}

DeleteArtifactPopUp.propTypes = {
  artifact: PropTypes.object.isRequired,
  artifactType: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  handleRefresh: PropTypes.func.isRequired
}

export default DeleteArtifactPopUp
