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
import React, { useReducer, useCallback, useEffect, useMemo } from 'react'
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
  generateDriftDetailsInfo,
  generateProducerDetailsInfo
} from './detailsInfo.util'

const DetailsInfo = React.forwardRef(
  (
    { detailsStore, formState, pageData, selectedItem, setChangesData, setChangesCounter },
    applyChangesRef
  ) => {
    const [detailsInfoState, detailsInfoDispatch] = useReducer(detailsInfoReducer, initialState)
    const params = useParams()
    const editItemRef = React.createRef()
    const dispatch = useDispatch()

    const onApplyChanges = useCallback(
      event => {
        if (applyChangesRef.current && applyChangesRef.current.contains(event.target)) {
          detailsInfoDispatch({
            type: detailsInfoActions.RESET_EDIT_MODE
          })
        }
      },
      [applyChangesRef]
    )

    useEffect(() => {
      dispatch(detailsActions.setEditMode(!isEveryObjectValueEmpty(detailsInfoState.editMode)))
    }, [detailsInfoState.editMode, dispatch])


    useEffect(() => {
      return () => {
        detailsInfoDispatch({
          type: detailsInfoActions.RESET_EDIT_MODE
        })
      }
    }, [detailsInfoDispatch, params.name])

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
    }, [])

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
        }
      },
      [detailsInfoState.editMode]
    )

    const sources = useMemo(
      () =>
        Array.isArray(selectedItem.sources)
          ? selectedItem.sources.reduce((prev, cur) => {
              let source = {}
              source[cur.name] = cur.path

              return { ...prev, ...source }
            }, {})
          : selectedItem.sources,
      [selectedItem.sources]
    )

    const producer = useMemo(() => generateProducerDetailsInfo(selectedItem), [selectedItem])

    const drift = useMemo(
      () => generateDriftDetailsInfo(detailsStore.modelEndpoint.data),
      [detailsStore.modelEndpoint.data]
    )

    const configuration = useMemo(
      () => generateConfigurationDetailsInfo(selectedItem),
      [selectedItem]
    )

    const finishEdit = useCallback(
      currentField => {
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
      [detailsStore.changes, formState, setChangesCounter, setChangesData]
    )

    return (
      <DetailsInfoView
        additionalInfo={{ configuration, drift, producer, sources }}
        detailsInfoDispatch={detailsInfoDispatch}
        detailsInfoState={detailsInfoState}
        detailsStore={detailsStore}
        formState={formState}
        handleDiscardChanges={handleDiscardChanges}
        handleFinishEdit={finishEdit}
        handleInfoItemClick={handleInfoItemClick}
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

export default DetailsInfo
