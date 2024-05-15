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

import { ConfirmDialog, FormRadio, FormKeyValueTable } from 'igz-controls/components'
import { TERTIARY_BUTTON, DANGER_BUTTON } from 'igz-controls/constants'

import { handleDeleteArtifact } from '../../utils/handleDeleteArtifact'
import { getValidationRules } from 'igz-controls/utils/validation.util'
import { setFieldState } from 'igz-controls/utils/form.util'

import './deleteArtifactPopUp.scss'

const DeleteArtifactPopUp = ({ artifact, artifactType, category, filters, handleRefresh }) => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(true)
  const dispatch = useDispatch()
  const params = useParams()
  const formRef = React.useRef(
    createForm({
      initialValues: {
        deletion_strategy: 'metadata-only',
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
        variant: DANGER_BUTTON
      }}
      header={`Delete ${artifactType}?`}
      isOpen={isConfirmDialogOpen}
      message={`Do you want to delete the ${artifactType} "${artifact.db_key}"? Deleted ${artifactType} can not be restored.`}
    >
      <Form form={formRef.current} onSubmit={() => {}}>
        {formState => {
          return (
            <>
              <FormRadio
                label="metadata-only"
                name="deletion_strategy"
                value="metadata-only"
                tooltip="Delete only the artifact object. The related artifact data remains."
              />
              <FormRadio
                label="data-optional"
                name="deletion_strategy"
                value="data-optional"
                tooltip="Delete the artifact object and the data. If data deletion is unsuccessful, deletes only the object."
              />
              <FormRadio
                label="data-force"
                name="deletion_strategy"
                value="data-force"
                tooltip="Delete the artifact object and the data. If data deletion is unsuccessful,  does not delete the object either."
              />
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
