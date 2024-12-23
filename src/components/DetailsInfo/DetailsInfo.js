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
import React, { useReducer, useCallback, useEffect, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import DetailsInfoView from './DetailsInfoView'

import detailsActions from '../../actions/details'
import { detailsInfoActions, detailsInfoReducer, initialState } from './detailsInfoReducer'
import { handleFinishEdit } from '../Details/details.util'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import {
  generateConfigurationDetailsInfo,
  generateDocumentLoaderDetailsInfo,
  generateDriftDetailsInfo,
  generateProducerDetailsInfo,
  generateSourcesDetailsInfo,
  generateAlertsDetailsInfo
} from './detailsInfo.util'

const DetailsInfo = React.forwardRef(
  (
    {
      detailsStore,
      formState,
      isDetailsPopUp,
      pageData,
      selectedItem,
      setChangesCounter,
      setChangesData
    },
    applyChangesRef
  ) => {
    const [detailsInfoState, detailsInfoDispatch] = useReducer(detailsInfoReducer, initialState)
    const params = useParams()
    const editItemRef = useRef()
    const dispatch = useDispatch()

    const onApplyChanges = useCallback(
      event => {
        if (applyChangesRef.current && applyChangesRef.current.contains(event.target)) {
          detailsInfoDispatch({
            type: detailsInfoActions.RESET_EDIT_MODE
          })
          dispatch(detailsActions.setEditMode(false))
        }
      },
      [applyChangesRef, dispatch]
    )

    useEffect(() => {
      return () => {
        detailsInfoDispatch({
          type: detailsInfoActions.RESET_EDIT_MODE
        })
        dispatch(detailsActions.setEditMode(false))
      }
    }, [detailsInfoDispatch, dispatch, params.name])

    useEffect(() => {
      window.addEventListener('click', onApplyChanges)

      return () => {
        window.removeEventListener('click', onApplyChanges)
      }
    }, [onApplyChanges])

    const handleDiscardChanges = useCallback(() => {
      detailsInfoDispatch({
        type: detailsInfoActions.RESET_EDIT_MODE
      })
      dispatch(detailsActions.setEditMode(false))
    }, [dispatch])

    const handleInfoItemClick = useCallback(
      (field, fieldType) => {
        if (isEveryObjectValueEmpty(detailsInfoState.editMode)) {
          detailsInfoDispatch({
            type: detailsInfoActions.SET_EDIT_MODE,
            payload: {
              field,
              fieldType
            }
          })
          dispatch(detailsActions.setEditMode(true))
        }
      },
      [detailsInfoState.editMode, dispatch]
    )

    const sources = useMemo(
      () => generateSourcesDetailsInfo(selectedItem, params.projectName),
      [params.projectName, selectedItem]
    )

    const producer = useMemo(
      () => generateProducerDetailsInfo(selectedItem, isDetailsPopUp),
      [selectedItem, isDetailsPopUp]
    )

    const document_loader = useMemo(
      () => generateDocumentLoaderDetailsInfo(selectedItem, isDetailsPopUp),
      [selectedItem, isDetailsPopUp]
    )

    const drift = useMemo(() => generateDriftDetailsInfo(selectedItem), [selectedItem])

    const alerts = useMemo(() => generateAlertsDetailsInfo(selectedItem), [selectedItem])

    const configuration = useMemo(
      () => generateConfigurationDetailsInfo(selectedItem),
      [selectedItem]
    )

    const finishEdit = useCallback(
      currentField => {
        dispatch(detailsActions.setEditMode(false))

        return handleFinishEdit(
          detailsStore.changes,
          detailsInfoActions,
          detailsInfoDispatch,
          setChangesData,
          setChangesCounter,
          currentField,
          formState
        )
      },
      [detailsStore.changes, dispatch, formState, setChangesCounter, setChangesData]
    )

    return (
      <DetailsInfoView
        additionalInfo={{ alerts, configuration, document_loader, drift, producer, sources }}
        detailsInfoDispatch={detailsInfoDispatch}
        detailsInfoState={detailsInfoState}
        detailsStore={detailsStore}
        formState={formState}
        handleDiscardChanges={handleDiscardChanges}
        handleFinishEdit={finishEdit}
        handleInfoItemClick={handleInfoItemClick}
        isDetailsPopUp={isDetailsPopUp}
        pageData={pageData}
        params={params}
        ref={editItemRef}
        selectedItem={selectedItem}
        setChangesData={setChangesData}
      />
    )
  }
)

DetailsInfo.propTypes = {
  detailsStore: PropTypes.shape({}).isRequired,
  formState: PropTypes.shape({}),
  pageData: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setChangesData: PropTypes.func.isRequired,
  setChangesCounter: PropTypes.func.isRequired
}

DetailsInfo.displayName = 'DetailsInfo'

export default DetailsInfo
