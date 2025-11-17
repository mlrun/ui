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
import { useLocation, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import DetailsInfoView from './DetailsInfoView'

import {
  generateConfigurationDetailsInfo,
  generateDocumentLoaderDetailsInfo,
  generateDriftDetailsInfo,
  generateProducerDetailsInfo,
  generateSourcesDetailsInfo,
  generateAlertsDetailsInfo
} from './detailsInfo.util'
import { detailsInfoActions, detailsInfoReducer, initialState } from './detailsInfoReducer'
import { handleFinishEdit } from '../Details/details.util'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { setEditMode } from 'igz-controls/reducers/commonDetailsReducer'

const DetailsInfo = React.forwardRef(
  ({ commonDetailsStore, formState, isDetailsPopUp, pageData, selectedItem }, applyChangesRef) => {
    const location = useLocation()
    const [detailsInfoState, detailsInfoDispatch] = useReducer(detailsInfoReducer, initialState)
    const params = useParams()
    const editItemRef = useRef()
    const dispatch = useDispatch()
    const pathnameWithoutTab = useMemo(
      () => location.pathname.substring(0, location.pathname.lastIndexOf(params.tab)),
      [location.pathname, params.tab]
    )

    const onApplyChanges = useCallback(
      event => {
        if (applyChangesRef.current && applyChangesRef.current.contains(event.target)) {
          detailsInfoDispatch({
            type: detailsInfoActions.RESET_EDIT_MODE
          })
          dispatch(setEditMode(false))
        }
      },
      [applyChangesRef, dispatch]
    )

    useEffect(() => {
      return () => {
        if (!isDetailsPopUp) {
          detailsInfoDispatch({
            type: detailsInfoActions.RESET_EDIT_MODE
          })
        }
      }
    }, [detailsInfoDispatch, isDetailsPopUp, pathnameWithoutTab])

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
      dispatch(setEditMode(false))
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
          dispatch(setEditMode(true))
        }
      },
      [detailsInfoState.editMode, dispatch]
    )

    const sources = useMemo(() => generateSourcesDetailsInfo(selectedItem), [selectedItem])

    const producer = useMemo(
      () => generateProducerDetailsInfo(selectedItem, isDetailsPopUp),
      [selectedItem, isDetailsPopUp]
    )

    const document_loader = useMemo(
      () => generateDocumentLoaderDetailsInfo(selectedItem, isDetailsPopUp, formState),
      [selectedItem, isDetailsPopUp, formState]
    )

    const drift = useMemo(() => generateDriftDetailsInfo(selectedItem), [selectedItem])

    const alerts = useMemo(() => generateAlertsDetailsInfo(selectedItem), [selectedItem])

    const configuration = useMemo(
      () => generateConfigurationDetailsInfo(selectedItem, formState),
      [selectedItem, formState]
    )

    const finishEdit = useCallback(
      currentField => {
        dispatch(setEditMode(false))

        return handleFinishEdit(
          commonDetailsStore.changes,
          detailsInfoActions,
          detailsInfoDispatch,
          currentField,
          formState,
          dispatch
        )
      },
      [commonDetailsStore.changes, dispatch, formState]
    )

    return (
      <DetailsInfoView
        additionalInfo={{ alerts, configuration, document_loader, drift, producer, sources }}
        detailsInfoDispatch={detailsInfoDispatch}
        detailsInfoState={detailsInfoState}
        commonDetailsStore={commonDetailsStore}
        formState={formState}
        handleDiscardChanges={handleDiscardChanges}
        handleFinishEdit={finishEdit}
        handleInfoItemClick={handleInfoItemClick}
        isDetailsPopUp={isDetailsPopUp}
        pageData={pageData}
        params={params}
        ref={editItemRef}
        selectedItem={selectedItem}
      />
    )
  }
)

DetailsInfo.displayName = 'DetailsInfo'

DetailsInfo.propTypes = {
  commonDetailsStore: PropTypes.object.isRequired,
  formState: PropTypes.object.isRequired,
  isDetailsPopUp: PropTypes.bool.isRequired,
  pageData: PropTypes.object.isRequired,
  selectedItem: PropTypes.object.isRequired
}

export default DetailsInfo
