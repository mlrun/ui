import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { OnChange } from 'react-final-form-listeners'
import { isNil, pick, uniqBy } from 'lodash'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { FormInput, TextTooltipTemplate, Tip, Tooltip, FormCombobox } from 'igz-controls/components'
import FormRowActions from 'igz-controls/elements/FormRowActions/FormRowActions'

import { FORM_TABLE_EDITING_ITEM } from 'igz-controls/types'
import {
  dataInputInitialState,
  comboboxSelectList,
  generateArtifactsList,
  generateArtifactsReferencesList,
  generateComboboxMatchesList,
  generateProjectsList,
  handleStoreInputPathChange,
  isPathInputInvalid,
  pathPlaceholders,
  pathTips
} from '../formDataInputsTable.util'
import { MLRUN_STORAGE_INPUT_PATH_SCHEME } from '../../../constants'
import { getFeatureReference } from '../../../utils/resources'
import { DATA_INPUT_STATE } from '../../../types'
import artifactsAction from '../../../actions/artifacts'
import featureStoreActions from '../../../actions/featureStore'

const FormDataInputsRow = ({
  applyChanges,
  dataInputState,
  deleteRow,
  disabled,
  discardOrDelete,
  editingItem,
  enterEditMode,
  fields,
  fieldsPath,
  index,
  projectStore,
  rowPath,
  setDataInputState,
  setFieldState,
  setFieldValue,
  uniquenessValidator
}) => {
  const [fieldData, setFieldData] = useState(fields.value[index])
  const params = useParams()
  const dispatch = useDispatch()

  const tableRowClassNames = classnames(
    'form-table__row',
    fieldsPath === editingItem?.ui?.fieldsPath && editingItem?.ui?.index === index && 'active'
  )

  const handleOnChange = (selectValue, inputValue) => {
    if (isNil(inputValue)) {
      setFieldState(`${rowPath}.data.path`, { modified: false })
    }

    if (selectValue === MLRUN_STORAGE_INPUT_PATH_SCHEME && !isNil(inputValue)) {
      handleStoreInputPathChange(dataInputState, setDataInputState, inputValue)
    }
  }

  const validatePath = allValues => {
    const { pathType, value } = pick(allValues.dataInputs.dataInputsTable[index].data.fieldInfo, [
      'pathType',
      'value'
    ])

    return isPathInputInvalid(pathType, value)
  }

  useEffect(() => {
    setFieldData(fields.value[index])
  }, [fields.value, index])

  useEffect(() => {
    if (dataInputState.inputStorePathTypeEntered && dataInputState.projects.length === 0) {
      setDataInputState(prev => ({
        ...prev,
        projects: generateProjectsList(projectStore.projectsNames.data, params.projectName)
      }))
    }
  }, [
    dataInputState.inputStorePathTypeEntered,
    dataInputState.projects.length,
    params.projectName,
    projectStore.projectsNames.data,
    setDataInputState
  ])

  useEffect(() => {
    if (fieldData.data.fieldInfo.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME) {
      setDataInputState(prev => ({
        ...prev,
        comboboxMatches: generateComboboxMatchesList(
          dataInputState.artifacts,
          dataInputState.artifactsReferences,
          dataInputState.featureVectors,
          dataInputState.featureVectorsReferences,
          dataInputState.inputProjectItemPathEntered,
          dataInputState.inputProjectItemReferencePathEntered,
          dataInputState.inputProjectPathEntered,
          dataInputState.inputStorePathTypeEntered,
          dataInputState.project,
          dataInputState.projectItem,
          dataInputState.projectItemReference,
          dataInputState.projects,
          dataInputState.storePathType
        )
      }))
    }
  }, [
    dataInputState.artifacts,
    dataInputState.artifactsReferences,
    dataInputState.featureVectors,
    dataInputState.featureVectorsReferences,
    dataInputState.inputProjectItemPathEntered,
    dataInputState.inputProjectItemReferencePathEntered,
    dataInputState.inputProjectPathEntered,
    dataInputState.inputStorePathTypeEntered,
    dataInputState.project,
    dataInputState.projectItem,
    dataInputState.projectItemReference,
    dataInputState.projects,
    dataInputState.storePathType,
    fieldData.data.fieldInfo.pathType,
    setDataInputState
  ])

  useEffect(() => {
    if (
      dataInputState.inputProjectPathEntered &&
      dataInputState.storePathType &&
      dataInputState.project
    ) {
      if (dataInputState.storePathType === 'artifacts' && dataInputState.artifacts.length === 0) {
        dispatch(artifactsAction.fetchArtifacts(dataInputState.project)).then(artifacts => {
          setDataInputState(prev => ({
            ...prev,
            artifacts: generateArtifactsList(artifacts)
          }))
        })
      } else if (
        dataInputState.storePathType === 'feature-vectors' &&
        dataInputState.featureVectors.length === 0
      ) {
        dispatch(featureStoreActions.fetchFeatureVectors(dataInputState.project)).then(
          featureVectors => {
            const featureVectorsList = uniqBy(featureVectors, 'metadata.name')
              .map(featureVector => ({
                label: featureVector.metadata.name,
                id: featureVector.metadata.name
              }))
              .sort((prevFeatureVector, nextFeatureVector) =>
                prevFeatureVector.id.localeCompare(nextFeatureVector.id)
              )

            setDataInputState(prev => ({
              ...prev,
              featureVectors: featureVectorsList
            }))
          }
        )
      }
    }
  }, [
    dataInputState.artifacts.length,
    dataInputState.featureVectors.length,
    dataInputState.inputProjectPathEntered,
    dataInputState.project,
    dataInputState.storePathType,
    dispatch,
    setDataInputState
  ])

  useEffect(() => {
    const storePathType = dataInputState.storePathType
    const projectName = dataInputState.project
    const projectItem = dataInputState.projectItem

    if (dataInputState.inputProjectItemPathEntered && storePathType && projectName && projectItem) {
      if (storePathType === 'artifacts' && dataInputState.artifactsReferences.length === 0) {
        dispatch(artifactsAction.fetchArtifact(projectName, projectItem)).then(artifacts => {
          if (artifacts.length > 0 && artifacts[0].data) {
            setDataInputState(prev => ({
              ...prev,
              artifactsReferences: generateArtifactsReferencesList(artifacts[0].data)
            }))
          }
        })
      } else if (
        storePathType === 'feature-vectors' &&
        dataInputState.featureVectorsReferences.length === 0
      ) {
        dispatch(featureStoreActions.fetchFeatureVector(projectName, projectItem)).then(
          featureVectors => {
            const featureVectorsReferencesList = featureVectors
              .map(featureVector => {
                let featureVectorReference = getFeatureReference(featureVector.metadata)

                return {
                  label: featureVectorReference,
                  id: featureVectorReference,
                  customDelimiter: featureVectorReference[0]
                }
              })
              .filter(featureVector => featureVector.label !== '')
              .sort((prevRef, nextRef) => prevRef.id.localeCompare(nextRef.id))

            setDataInputState(prev => ({
              ...prev,
              featureVectorsReferences: featureVectorsReferencesList
            }))
          }
        )
      }
    }
  }, [
    dataInputState.artifactsReferences.length,
    dataInputState.featureVectorsReferences.length,
    dataInputState.inputProjectItemPathEntered,
    dataInputState.project,
    dataInputState.projectItem,
    dataInputState.storePathType,
    dispatch,
    setDataInputState
  ])

  return (
    <>
      {editingItem &&
      index === editingItem.ui?.index &&
      fieldsPath === editingItem.ui?.fieldsPath &&
      !disabled ? (
        <div className={tableRowClassNames} key={index}>
          <div className="form-table__cell form-table__cell_1">
            <FormInput
              density="dense"
              name={`${rowPath}.data.name`}
              placeholder="Name"
              required
              validationRules={[
                {
                  name: 'uniqueness',
                  label: 'Name should be unique',
                  pattern: newValue => uniquenessValidator(fields, newValue)
                }
              ]}
            />
          </div>
          <div className="form-table__cell form-table__cell_1">
            <FormCombobox
              density="dense"
              hideSearchInput={!dataInputState.inputStorePathTypeEntered}
              inputDefaultValue={editingItem.data.fieldInfo?.value}
              inputPlaceholder={pathPlaceholders[fieldData.data.fieldInfo?.pathType]}
              invalidText={`Field must be in "${
                pathTips(dataInputState.storePathType)[fieldData.data.fieldInfo?.pathType]
              }" format`}
              maxSuggestedMatches={
                fieldData.data.fieldInfo.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME ? 3 : 2
              }
              name={`${rowPath}.data.path`}
              onChange={(selectValue, inputValue) => handleOnChange(selectValue, inputValue)}
              required
              selectDefaultValue={comboboxSelectList.find(
                option =>
                  editingItem.data.path && option.id === editingItem.data.fieldInfo?.pathType
              )}
              selectOptions={comboboxSelectList}
              selectPlaceholder="Path Scheme"
              suggestionList={
                fieldData.data.fieldInfo.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME
                  ? dataInputState.comboboxMatches
                  : []
              }
              validator={(fieldValue, allValues) => validatePath(allValues)}
            />
          </div>
          <FormRowActions
            applyChanges={applyChanges}
            deleteRow={deleteRow}
            discardOrDelete={discardOrDelete}
            editingItem={editingItem}
            fieldsPath={fieldsPath}
            index={index}
          />
        </div>
      ) : (
        <div
          className={tableRowClassNames}
          key={index}
          onClick={event => {
            setDataInputState(dataInputInitialState)
            handleStoreInputPathChange(
              dataInputState,
              setDataInputState,
              fields.value[index].data.fieldInfo.value
            )
            enterEditMode(event, fields, fieldsPath, index)
          }}
        >
          <div
            className={classnames(
              'form-table__cell',
              'form-table__cell_1',
              'form-table__name-cell'
            )}
          >
            <Tooltip template={<TextTooltipTemplate text={fieldData.data.name} />}>
              {fieldData.data.name}
            </Tooltip>
            {fields.value[index].doc && <Tip text={fields.value[index].doc} />}
          </div>
          <div className={classnames('form-table__cell', 'form-table__cell_1')}>
            <Tooltip template={<TextTooltipTemplate text={fieldData.data.path} />}>
              {fieldData.data.path}
            </Tooltip>
          </div>
          <FormRowActions
            applyChanges={applyChanges}
            deleteRow={deleteRow}
            discardOrDelete={discardOrDelete}
            editingItem={editingItem}
            fieldsPath={fieldsPath}
            index={index}
          />
        </div>
      )}
      <OnChange name={`${rowPath}.data.path`}>
        {value => {
          if (editingItem) {
            if (value.length !== 0) {
              setFieldValue(`${rowPath}.data.fieldInfo.value`, value.replace(/.*:[/]{2,3}/g, ''))
              setFieldValue(`${rowPath}.data.fieldInfo.pathType`, value.match(/^\w*:[/]{2,3}/)[0])
            }
          }
        }}
      </OnChange>
      <OnChange name={`${rowPath}.data.fieldInfo.pathType`}>
        {(value, prevValue) => {
          if (editingItem) {
            if (prevValue === MLRUN_STORAGE_INPUT_PATH_SCHEME) {
              setDataInputState(dataInputInitialState)
            }
          }
        }}
      </OnChange>
    </>
  )
}

FormDataInputsRow.defaultProps = {
  disabled: false,
  editingItem: null
}

FormDataInputsRow.propTypes = {
  applyChanges: PropTypes.func.isRequired,
  dataInputState: DATA_INPUT_STATE,
  deleteRow: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  discardOrDelete: PropTypes.func.isRequired,
  editingItem: FORM_TABLE_EDITING_ITEM,
  enterEditMode: PropTypes.func.isRequired,
  fields: PropTypes.shape({}).isRequired,
  fieldsPath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  rowPath: PropTypes.string.isRequired,
  setFieldState: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  uniquenessValidator: PropTypes.func.isRequired
}

export default FormDataInputsRow
