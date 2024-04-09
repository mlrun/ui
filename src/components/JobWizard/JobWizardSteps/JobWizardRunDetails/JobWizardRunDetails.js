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
import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { get, isEmpty, omit, set } from 'lodash'
import { FieldArray } from 'react-final-form-arrays'

import {
  ConfirmDialog,
  FormCheckBox,
  FormChipCell,
  FormInput,
  FormSelect,
  FormTextarea,
  Tooltip,
  TextTooltipTemplate
} from 'igz-controls/components'
import FormOnChange from '../../../../common/FormOnChange/FormOnChange'

import {
  DATA_INPUTS_STEP,
  EXISTING_IMAGE_SOURCE,
  PARAMETERS_STEP,
  RUN_DETAILS_STEP,
  TAG_NA
} from '../../../../constants'
import { SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { areFormValuesChanged } from 'igz-controls/utils/form.util'
import { getChipOptions } from '../../../../utils/getChipOptions'
import { getValidationRules } from 'igz-controls/utils/validation.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import {
  generateJobWizardData,
  getFunctionParameters,
  getHandlerData,
  parseDataInputs,
  parsePredefinedParameters
} from '../../JobWizard.util'

import './jobWizardRunDetails.scss'

const JobWizardRunDetails = ({
  formState,
  frontendSpec,
  isBatchInference,
  isEditMode,
  jobAdditionalData,
  params,
  prePopulatedData,
  selectedFunctionData,
  setJobData,
  stepIsActive
}) => {
  const handlerPath = `${RUN_DETAILS_STEP}.handler`
  const versionPath = `${RUN_DETAILS_STEP}.version`
  const imageSourcePath = `${RUN_DETAILS_STEP}.image.imageSource`
  const outputsPath = `${RUN_DETAILS_STEP}.handlerData.outputs`
  const [spyOnHandlerChange, setSpyOnHandlerChange] = useState(true)
  const [spyOnVersionChange, setSpyOnVersionChange] = useState(true)
  const commonImageWarningMsg =
    'The image must include all the software packages that are required to run the function. ' +
    'For example, for an XGBoost model, ensure that the image includes the correct XGboost package and version'
  const batchInferenceWarningMsg =
    'The image must include all the software packages that are required to run the model. ' +
    'For example, for an XGBoost model, ensure that the image includes the correct XGboost package and version'

  const selectedImageSource = useMemo(
    () => get(formState.values, imageSourcePath, EXISTING_IMAGE_SOURCE),
    [formState.values, imageSourcePath]
  )

  const handleVersionChange = version => {
    const [jobFormData, jobAdditionalData] = generateJobWizardData(
      frontendSpec,
      selectedFunctionData,
      null,
      params.projectName,
      isEditMode,
      false,
      null,
      version
    )
    setJobData(formState, jobFormData, jobAdditionalData)

    setSpyOnVersionChange(true)
  }

  const onVersionChange = (currentVersion, prevVersion) => {
    setSpyOnVersionChange(false)
    const values = omit(formState.values, [versionPath])
    const initialValues = omit(formState.initialValues, [versionPath])

    if (areFormValuesChanged(values, initialValues)) {
      openPopUp(ConfirmDialog, {
        cancelButton: {
          label: 'Cancel',
          variant: TERTIARY_BUTTON,
          handler: () => {
            formState.form.change(versionPath, prevVersion)
            setSpyOnVersionChange(true)
          }
        },
        confirmButton: {
          label: 'OK',
          variant: SECONDARY_BUTTON,
          handler: () => {
            handleVersionChange(currentVersion)
          }
        },
        header: 'Are you sure?',
        message: 'You have unsaved changes. All changes will be lost'
      })
    } else {
      handleVersionChange(currentVersion)
    }
  }

  const handleHandlerChange = handler => {
    const selectedFunction =
      selectedFunctionData?.functions?.length === 1
        ? selectedFunctionData.functions[0]
        : selectedFunctionData.functions?.find(
            func => func.metadata.tag === formState.values[RUN_DETAILS_STEP].version
          )

    const functionParameters = getFunctionParameters(selectedFunction, handler)
    const dataInputs = parseDataInputs(functionParameters, prePopulatedData?.trainDatasetUri)
    const predefinedParameters = parsePredefinedParameters(functionParameters)
    const handlerData = getHandlerData(selectedFunction, handler)

    set(formState.initialValues, `${DATA_INPUTS_STEP}.dataInputsTable`, dataInputs)
    set(
      formState.initialValues,
      `${PARAMETERS_STEP}.parametersTable.predefined`,
      predefinedParameters
    )
    set(formState.initialValues, `${RUN_DETAILS_STEP}.handlerData`, handlerData)
    formState.form.change(`${DATA_INPUTS_STEP}.dataInputsTable`, dataInputs)
    formState.form.change(`${PARAMETERS_STEP}.parametersTable.predefined`, predefinedParameters)
    formState.form.change(`${RUN_DETAILS_STEP}.handlerData`, handlerData)
    formState.form.change(
      `${PARAMETERS_STEP}.parametersTable.custom`,
      get(formState.initialValues, `${PARAMETERS_STEP}.parametersTable.custom`, [])
    )

    setSpyOnHandlerChange(true)
  }

  const onHandlerChange = (currentHandler, prevHandler) => {
    setSpyOnHandlerChange(false)

    const dataInputsAreChanged = areFormValuesChanged(
      formState.initialValues[DATA_INPUTS_STEP].dataInputsTable,
      formState.values[DATA_INPUTS_STEP].dataInputsTable
    )
    const predefinedParametersAreChanged = areFormValuesChanged(
      formState.initialValues[PARAMETERS_STEP].parametersTable.predefined,
      formState.values[PARAMETERS_STEP].parametersTable.predefined
    )
    const customParametersAreChanged = areFormValuesChanged(
      formState.initialValues[PARAMETERS_STEP].parametersTable.custom,
      formState.values[PARAMETERS_STEP].parametersTable.custom
    )

    if (dataInputsAreChanged || predefinedParametersAreChanged || customParametersAreChanged) {
      openPopUp(ConfirmDialog, {
        cancelButton: {
          label: 'Cancel',
          variant: TERTIARY_BUTTON,
          handler: () => {
            formState.form.change(handlerPath, prevHandler)
            setSpyOnHandlerChange(true)
          }
        },
        confirmButton: {
          label: 'OK',
          variant: SECONDARY_BUTTON,
          handler: () => {
            handleHandlerChange(currentHandler)
          }
        },
        header: 'Are you sure?',
        message: 'Changes made to the Data Inputs and Parameters sections will be lost'
      })
    } else {
      handleHandlerChange(currentHandler)
    }
  }

  return (
    !isEmpty(jobAdditionalData) && (
      <div className="job-wizard__run-details">
        <div className="form-row">
          <h5 className="form-step-title">Run Details</h5>
        </div>
        {!isBatchInference && (
          <div className="form-row">
            <FormCheckBox label="Hyperparameter" name={`${RUN_DETAILS_STEP}.hyperparameter`} />
          </div>
        )}
        <div className="form-row">
          <div className="form-col-2">
            <FormInput
              label="Run name"
              name={`${RUN_DETAILS_STEP}.runName`}
              disabled={isEditMode}
              required
              validationRules={getValidationRules('common.name')}
            />
          </div>
          {jobAdditionalData.versionOptions?.length !== 0 && (
            <div className="form-col-1">
              <FormSelect
                name={versionPath}
                label="Version"
                disabled={
                  jobAdditionalData?.versionOptions?.length === 1 &&
                  jobAdditionalData.versionOptions[0].id === TAG_NA
                }
                options={jobAdditionalData.versionOptions || []}
              />
            </div>
          )}
          {!isBatchInference ? (
            jobAdditionalData.handlerOptions?.length !== 0 ? (
              <div className="form-col-1">
                <FormSelect
                  label="Handler"
                  name={handlerPath}
                  options={jobAdditionalData.handlerOptions || []}
                  scrollToView={false}
                />
              </div>
            ) : (
              <div className="form-col-1">
                <FormInput label="Handler" name={handlerPath} disabled={isEditMode} />
              </div>
            )
          ) : null}
        </div>
        <div className="form-row">
          <FormChipCell
            chipOptions={getChipOptions('metrics')}
            formState={formState}
            initialValues={formState.initialValues}
            isEditable
            label="labels"
            name={`${RUN_DETAILS_STEP}.labels`}
            shortChips
            visibleChipsMaxLength="all"
            validationRules={{
              key: getValidationRules('job.label.key'),
              value: getValidationRules('job.label.value')
            }}
          />
        </div>

        {/*todo: Uncomment when BE implements "Building a new image"*/}
        {/*<div className="form-row">*/}
        {/*  <FormRadio*/}
        {/*    name={imageSourcePath}*/}
        {/*    value={EXISTING_IMAGE_SOURCE}*/}
        {/*    label="Use an existing image"*/}
        {/*  />*/}
        {/*  <FormRadio name={imageSourcePath} value={NEW_IMAGE_SOURCE} label="Build a new image" />*/}
        {/*</div>*/}
        {selectedImageSource === EXISTING_IMAGE_SOURCE ? (
          <>
            <FormInput
              name={`${RUN_DETAILS_STEP}.image.imageName`}
              label="Image name"
              required
              tip="The name of the function's container image"
            />
            <div className="warning-text">
              {isBatchInference ? batchInferenceWarningMsg : commonImageWarningMsg}
            </div>
          </>
        ) : (
          <>
            <div className="form-row">
              <FormInput
                name={`${RUN_DETAILS_STEP}.image.resultingImage`}
                label="Resulting image"
                required
                tip="The name of the built container image"
              />
            </div>
            <div className="form-row">
              <FormInput
                name={`${RUN_DETAILS_STEP}.image.baseImage"`}
                label="Base image"
                required
                tip="The name of a base container image from which to build the function's processor image"
              />
            </div>
            <div className="form-row">
              <div className="form-col-1">
                <FormTextarea
                  name={`${RUN_DETAILS_STEP}.image.buildCommands`}
                  label="Build commands"
                />
              </div>
              <div className="form-col-1">
                <FormTextarea
                  name={`${RUN_DETAILS_STEP}.image.pythonRequirement`}
                  label="Python requirement"
                />
              </div>
            </div>
          </>
        )}
        {get(formState.values, `${RUN_DETAILS_STEP}.handlerData.doc`, '') && (
          <>
            <div className="form-row form-table-title">Description</div>
            <div className="form-row">{formState.values[RUN_DETAILS_STEP].handlerData.doc}</div>
          </>
        )}
        {get(formState.values, outputsPath, []).length > 0 && (
          <>
            <div className="form-row form-table-title">Outputs</div>
            <div className="form-table">
              <div className="form-table__row form-table__header-row no-hover">
                <div className="form-table__cell form-table__cell_1">
                  <Tooltip template={<TextTooltipTemplate text="Type" />}>Type</Tooltip>
                </div>
                <div className="form-table__cell form-table__cell_1">
                  <Tooltip template={<TextTooltipTemplate text="Description" />}>
                    Description
                  </Tooltip>
                </div>
              </div>
              <FieldArray name={outputsPath}>
                {({ fields }) => {
                  return (
                    <>
                      {fields.map(rowPath => {
                        const data = get(formState.values, rowPath)

                        return (
                          <div className="form-table__row" key={data?.doc || data?.type}>
                            <div className="form-table__cell form-table__cell_1">{data?.type}</div>
                            <div className="form-table__cell form-table__cell_1">{data?.doc}</div>
                          </div>
                        )
                      })}
                    </>
                  )
                }}
              </FieldArray>
            </div>
          </>
        )}
        {stepIsActive && spyOnHandlerChange && (
          <FormOnChange handler={onHandlerChange} name={handlerPath} />
        )}
        {stepIsActive && spyOnVersionChange && (
          <FormOnChange handler={onVersionChange} name={versionPath} />
        )}
      </div>
    )
  )
}

JobWizardRunDetails.propTypes = {
  formState: PropTypes.shape({}).isRequired,
  frontendSpec: PropTypes.shape({}).isRequired,
  isBatchInference: PropTypes.bool.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  jobAdditionalData: PropTypes.shape({}).isRequired,
  params: PropTypes.shape({}).isRequired,
  prePopulatedData: PropTypes.shape({}).isRequired,
  selectedFunctionData: PropTypes.shape({}).isRequired,
  setJobData: PropTypes.func.isRequired
}

export default JobWizardRunDetails
